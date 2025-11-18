import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Schedule from "../models/schedule.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import CounterTransaction from "../models/counter-transaction.model.js";
import QRCode from "qrcode";
import { BookingError, SeatUnavailableError } from "../utils/errors.js";

class CounterBookingService {
  /**
   * Create booking at counter
   */
  async createCounterBooking(staffId, bookingData) {
    const session = await mongoose.startSession();

    try {
      return await session.withTransaction(async () => {
        const { scheduleId, seats, products, customerInfo, paymentMethod, cashReceived } = bookingData;

        // 1. Get staff info
        const staff = await User.findById(staffId).populate("staffInfo.assignedTheater");
        if (!staff || staff.role !== "staff") {
          throw new BookingError("Chỉ nhân viên mới có thể tạo booking tại quầy");
        }

        // 2. Validate schedule
        const schedule = await Schedule.findById(scheduleId).populate("movie", "title").populate("theater", "name");

        if (!schedule) {
          throw new BookingError("Không tìm thấy suất chiếu");
        }

        if (schedule.status !== "Đang mở bán vé") {
          throw new BookingError("Suất chiếu không còn mở bán vé");
        }

        // 3. Atomic seat holding
        const seatNumbers = seats.map((s) => s.seatNumber);
        const atomicSchedule = await Schedule.findOneAndUpdate(
          {
            _id: scheduleId,
            status: "Đang mở bán vé",
            $and: seatNumbers.map((seatNum) => ({
              seatAvailability: {
                $elemMatch: {
                  seatNumber: seatNum,
                  isBooked: false,
                  $or: [{ holdUntil: { $exists: false } }, { holdUntil: null }, { holdUntil: { $lt: new Date() } }],
                },
              },
            })),
          },
          {
            $set: seatNumbers.reduce((update, seatNum) => {
              update[`seatAvailability.$[seat_${seatNum}].isBooked`] = true;
              return update;
            }, {}),
          },
          {
            arrayFilters: seatNumbers.map((seatNum) => ({
              [`seat_${seatNum}.seatNumber`]: seatNum,
            })),
            new: true,
            session,
          }
        );

        if (!atomicSchedule) {
          throw new SeatUnavailableError(seatNumbers);
        }

        // 4. Calculate ticket prices
        let ticketsAmount = 0;
        const validatedSeats = seats.map((seat) => {
          const scheduleSeat = atomicSchedule.seatAvailability.find((s) => s.seatNumber === seat.seatNumber);

          let price;
          switch (scheduleSeat.seatType) {
            case "VIP":
              price = atomicSchedule.ticketPrices.vip;
              break;
            case "Ghế đôi":
              price = atomicSchedule.ticketPrices.couple;
              break;
            default:
              price = atomicSchedule.ticketPrices.standard;
          }

          ticketsAmount += price;
          return {
            seatNumber: seat.seatNumber,
            seatType: scheduleSeat.seatType,
            price,
          };
        });

        // 5. Handle products
        let productsAmount = 0;
        let orderedProducts = [];

        if (products && products.length > 0) {
          for (const item of products) {
            const product = await Product.findOneAndUpdate(
              {
                _id: item.productId,
                inStock: true,
                stockQuantity: { $gte: item.quantity },
              },
              {
                $inc: { stockQuantity: -item.quantity },
              },
              {
                new: true,
                session,
              }
            );

            if (!product) {
              throw new BookingError("Sản phẩm không đủ số lượng");
            }

            if (product.stockQuantity === 0) {
              await Product.updateOne({ _id: product._id }, { inStock: false }, { session });
            }

            const itemTotal = product.price * item.quantity;
            productsAmount += itemTotal;

            orderedProducts.push({
              product: product._id,
              productName: product.name,
              quantity: item.quantity,
              priceAtBooking: product.price,
              size: item.size || "N/A",
            });
          }
        }

        // 6. Handle customer (create guest if needed)
        let customer;
        let isGuestCustomer = false;

        if (customerInfo.customerId) {
          customer = await User.findById(customerInfo.customerId);
        } else {
          // Create guest customer
          const guestEmail = `guest_${Date.now()}@counter.local`;
          customer = new User({
            email: guestEmail,
            fullName: customerInfo.fullName,
            phoneNumber: customerInfo.phoneNumber,
            role: "customer",
            authProvider: "local",
            password: Math.random().toString(36).substring(7), // Random password
          });
          await customer.save({ session });
          isGuestCustomer = true;
        }

        // 6.5. ✅ FIX: Handle voucher if provided
        let discountAmount = 0;
        let appliedVoucher = null;

        // Calculate subtotal first (needed for voucher validation and total calculation)
        const subtotal = ticketsAmount + productsAmount;

        if (bookingData.voucherCode) {
          const Voucher = (await import("../models/voucher.model.js")).default;

          // Validate voucher
          const voucher = await Voucher.findOne({
            code: bookingData.voucherCode.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
            minOrderValue: { $lte: subtotal },
            $expr: { $lt: ["$usageCount", "$usageLimit"] },
          }).session(session);

          if (!voucher) {
            throw new BookingError("Mã voucher không hợp lệ, đã hết hạn, không đủ điều kiện hoặc đã hết lượt sử dụng");
          }

          // Check if customer can use this voucher
          if (customer && customer.membershipLevel) {
            const canUse = voucher.canBeUsedBy(customer._id, customer.membershipLevel);
            if (!canUse.valid) {
              throw new BookingError(canUse.message || "Không thể sử dụng voucher này");
            }
          }

          // Apply voucher
          await Voucher.findByIdAndUpdate(
            voucher._id,
            {
              $inc: { usageCount: 1 },
              $push: {
                usedBy: {
                  user: customer._id,
                  bookingId: null, // Will update after booking created
                  usedAt: new Date(),
                },
              },
            },
            { session }
          );

          // Calculate discount
          if (voucher.discountType === "fixed") {
            discountAmount = voucher.discountValue;
          } else {
            discountAmount = Math.floor((subtotal * voucher.discountValue) / 100);
          }

          // Apply max discount limit if exists
          if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
            discountAmount = voucher.maxDiscountAmount;
          }

          appliedVoucher = voucher._id;
        }

        // 7. Calculate totals
        const totalAmount = subtotal - discountAmount;

        // 8. Create booking
        const newBooking = new Booking({
          customer: customer._id,
          schedule: scheduleId,
          movieTitle: atomicSchedule.movie.title,
          theaterName: atomicSchedule.theater.name,
          roomName: atomicSchedule.roomName,
          showDate: atomicSchedule.showDate,
          showTime: `${atomicSchedule.startTime} - ${atomicSchedule.endTime}`,
          seats: validatedSeats,
          products: orderedProducts,
          appliedVoucher,
          voucherCode: bookingData.voucherCode?.toUpperCase(),
          ticketsAmount,
          productsAmount,
          subtotal,
          discountAmount,
          totalAmount,
          status: "Hoàn tất", // Counter bookings are immediately completed
          paymentDetails: {
            paymentMethod: paymentMethod === "cash" ? "Tại quầy" : paymentMethod,
            status: "Thành công",
            amount: totalAmount,
            paymentDate: new Date(),
            transactionId: `COUNTER_${Date.now()}`,
          },
        });

        await newBooking.save({ session });

        // 8.5. ✅ FIX: Update bookingId vào voucher.usedBy sau khi tạo booking
        if (appliedVoucher) {
          const Voucher = (await import("../models/voucher.model.js")).default;
          await Voucher.updateOne(
            {
              _id: appliedVoucher,
              "usedBy.user": customer._id,
              "usedBy.bookingId": null,
            },
            {
              $set: {
                "usedBy.$.bookingId": newBooking._id,
              },
            },
            { session }
          );
        }

        // 9. Update schedule booked count
        atomicSchedule.bookedSeatsCount = atomicSchedule.seatAvailability.filter((seat) => seat.isBooked).length;
        await atomicSchedule.save({ session });

        // 10. Generate QR code
        try {
          const qrData = JSON.stringify({
            bookingId: newBooking._id.toString(),
            bookingCode: newBooking.bookingCode,
            movieTitle: newBooking.movieTitle,
            theaterName: newBooking.theaterName,
            roomName: newBooking.roomName,
            showDate: newBooking.showDate.toISOString().split("T")[0],
            showTime: newBooking.showTime,
            seats: newBooking.seats.map((s) => s.seatNumber).join(", "),
            totalAmount: newBooking.totalAmount,
            timestamp: new Date().toISOString(),
          });

          const qrCodeUrl = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: "M",
            type: "image/png",
            quality: 0.92,
            margin: 1,
            width: 256,
          });

          newBooking.qrCode = qrCodeUrl;
          await newBooking.save({ session });
        } catch (qrError) {
          console.error("QR Code generation error:", qrError);
        }

        // 11. Create counter transaction record
        const counterTransaction = new CounterTransaction({
          staff: staffId,
          staffName: staff.fullName,
          theater: staff.staffInfo?.assignedTheater?._id,
          theaterName: staff.staffInfo?.assignedTheater?.name,
          booking: newBooking._id,
          customer: customer._id,
          customerName: customer.fullName,
          customerPhone: customer.phoneNumber,
          customerEmail: customer.email,
          isGuestCustomer,
          movieTitle: newBooking.movieTitle,
          showTime: newBooking.showTime,
          seats: validatedSeats,
          products: orderedProducts,
          paymentMethod: paymentMethod,
          totalAmount,
          cashReceived: cashReceived || totalAmount,
          changeGiven: cashReceived ? cashReceived - totalAmount : 0,
          shift: staff.staffInfo?.shift,
          status: "completed",
        });

        await counterTransaction.save({ session });

        return {
          booking: newBooking,
          transaction: counterTransaction,
          customer: {
            id: customer._id,
            name: customer.fullName,
            phone: customer.phoneNumber,
            isGuest: isGuestCustomer,
          },
        };
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Get counter transactions for staff
   */
  async getStaffTransactions(staffId, startDate, endDate) {
    return await CounterTransaction.getStaffTransactions(staffId, startDate, endDate);
  }

  /**
   * Get counter transactions for theater
   */
  async getTheaterTransactions(theaterId, date) {
    return await CounterTransaction.getTheaterTransactions(theaterId, date);
  }
}

const counterBookingService = new CounterBookingService();

export default counterBookingService;
