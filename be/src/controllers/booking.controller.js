import Booking from "../models/booking.model.js";
import Schedule from "../models/schedule.model.js";
import Product from "../models/product.model.js";
import Voucher from "../models/voucher.model.js";
import User from "../models/user.model.js";
import QRCode from "qrcode";

// Import services
import emailService from "../services/email.service.js";
import smsService from "../services/sms.service.js";
import redisService from "../services/redis.service.js";
import websocketService from "../services/websocket.service.js";
import Notification from "../models/notification.model.js";

import { successResponse, errorResponse } from "../utils/response.js";

const bookingController = {
  // Tạo đơn đặt vé mới
  createBooking: async (req, res) => {
    try {
      const {
        scheduleId,
        seats, // [{ seatNumber, seatType, price }]
        products, // [{ productId, quantity }]
        voucherCode,
      } = req.body;

      // 1. Validate schedule
      const schedule = await Schedule.findById(scheduleId).populate("movie", "title").populate("theater", "name");

      if (!schedule) {
        return errorResponse(res, "Không tìm thấy suất chiếu", 404);
      }

      if (schedule.status !== "Đang mở bán vé") {
        return errorResponse(res, "Suất chiếu không còn mở bán vé", 400);
      }

      // 2. Validate và hold ghế
      const seatNumbers = seats.map((s) => s.seatNumber);

      // Kiểm tra ghế có available không
      const unavailableSeats = schedule.seatAvailability.filter(
        (seat) =>
          seatNumbers.includes(seat.seatNumber) && (seat.isBooked || (seat.holdUntil && seat.holdUntil > new Date()))
      );

      if (unavailableSeats.length > 0) {
        // return errorResponse(res, "Một số ghế đã được đặt hoặc đang được giữ", 400);
        return errorResponse(
          res,
          `Một số ghế đã được đặt hoặc đang được giữ: ${unavailableSeats.map((s) => s.seatNumber).join(", ")}`,
          400
        );
      }

      // 3. Tính tiền vé
      let ticketsAmount = 0;
      const validatedSeats = seats.map((seat) => {
        const scheduleSeat = schedule.seatAvailability.find((s) => s.seatNumber === seat.seatNumber);
        if (!scheduleSeat) {
          throw new Error(`Ghế ${seat.seatNumber} không tồn tại`);
        }

        // Lấy giá từ schedule
        let price;
        switch (scheduleSeat.seatType) {
          case "VIP":
            price = schedule.ticketPrices.vip;
            break;
          case "Ghế đôi":
            price = schedule.ticketPrices.couple;
            break;
          default:
            price = schedule.ticketPrices.standard;
        }

        ticketsAmount += price;
        return {
          seatNumber: seat.seatNumber,
          seatType: scheduleSeat.seatType,
          price,
        };
      });

      // 4. Xử lý products
      let productsAmount = 0;
      let orderedProducts = [];

      if (products && products.length > 0) {
        for (const item of products) {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
          }
          if (!product.inStock) {
            throw new Error(`Sản phẩm ${product.name} đã hết hàng`);
          }

          const itemTotal = product.price * item.quantity;
          productsAmount += itemTotal;

          orderedProducts.push({
            product: product._id,
            productName: product.name,
            quantity: item.quantity,
            priceAtBooking: product.price,
            size: item.size || product.size,
          });
        }
      }

      // 5. Xử lý voucher
      let discountAmount = 0;
      let appliedVoucher = null;

      if (voucherCode) {
        const voucher = await Voucher.findOne({
          code: voucherCode.toUpperCase(),
          isActive: true,
        });

        if (!voucher) {
          return errorResponse(res, "Mã voucher không hợp lệ", 400);
        }

        // Validate voucher
        const now = new Date();
        if (now < voucher.startDate || now > voucher.endDate) {
          return errorResponse(res, "Voucher đã hết hạn hoặc chưa đến thời gian sử dụng", 400);
        }

        if (voucher.usageCount >= voucher.usageLimit) {
          return errorResponse(res, "Voucher đã hết lượt sử dụng", 400);
        }

        const subtotal = ticketsAmount + productsAmount;
        if (subtotal < voucher.minOrderValue) {
          return errorResponse(res, `Đơn hàng tối thiểu ${voucher.minOrderValue}đ để sử dụng voucher này`, 400);
        }

        // Tính discount
        if (voucher.discountType === "fixed") {
          discountAmount = voucher.discountValue;
        } else {
          discountAmount = Math.floor((subtotal * voucher.discountValue) / 100);
        }

        appliedVoucher = voucher._id;

        // Cập nhật usage count
        voucher.usageCount += 1;
        await voucher.save();
      }

      // 6. Tính tổng tiền
      const subtotal = ticketsAmount + productsAmount;
      const totalAmount = subtotal - discountAmount;

      // 7. Tạo booking (tạm thời)
      const newBooking = new Booking({
        customer: req.userId,
        schedule: scheduleId,
        movieTitle: schedule.movie.title,
        theaterName: schedule.theater.name,
        roomName: schedule.roomName,
        showDate: schedule.showDate,
        showTime: `${schedule.startTime} - ${schedule.endTime}`,
        seats: validatedSeats,
        products: orderedProducts,
        appliedVoucher,
        voucherCode: voucherCode?.toUpperCase(),
        ticketsAmount,
        productsAmount,
        subtotal,
        discountAmount,
        totalAmount,
        status: "Chờ thanh toán",
        paymentDetails: {
          paymentMethod: "Chưa xác định",
          status: "Chờ thanh toán",
          amount: totalAmount,
        },
      });

      await newBooking.save();

      // 8. Hold ghế trong schedule (10 phút)
      await schedule.holdSeats(seatNumbers, newBooking._id, 10);

      // 9. Broadcast qua WebSocket
      websocketService.emitToSchedule(scheduleId, "seats-status-changed", {
        scheduleId,
        seatAvailability: schedule.seatAvailability,
        action: "held",
        seatNumbers,
        userId: req.userId,
      });

      // 10. Cache booking tạm trong Redis (15 phút)
      await redisService.set(
        `booking:temp:${newBooking._id}`,
        newBooking,
        900 // 15 phút
      );

      // 11. Tạo payment session (VNPay, MoMo, etc.)
      // TODO: Integrate với payment gateway

      return successResponse(
        res,
        {
          bookingId: newBooking._id,
          bookingCode: newBooking.bookingCode,
          totalAmount: newBooking.totalAmount,
          holdUntil: new Date(Date.now() + 10 * 60 * 1000),
          // paymentUrl: 'vnpay_url_here'
        },
        "Tạo đơn đặt vé thành công. Vui lòng thanh toán trong 10 phút",
        201
      );
    } catch (error) {
      console.error("Create booking error:", error);
      return errorResponse(res, error.message || "Lỗi server", 500);
    }
  },

  // Xác nhận thanh toán
  confirmPayment: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { paymentMethod, transactionId } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, error.message || "Lỗi server", 500);
      }

      if (booking.customer.toString() !== req.userId) {
        return errorResponse(res, "Bạn không có quyền thực hiện hành động này", 403);
      }

      if (booking.status !== "Chờ thanh toán") {
        return errorResponse(res, "Đơn đặt vé không ở trạng thái chờ thanh toán", 400);
      }

      // TODO: Verify payment với payment gateway

      // Cập nhật booking
      booking.status = "Hoàn tất";
      booking.paymentDetails = {
        paymentMethod,
        transactionId,
        status: "Thành công",
        amount: booking.totalAmount,
        paymentDate: new Date(),
      };

      // Generate QR code
      const qrData = JSON.stringify({
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        movieTitle: booking.movieTitle,
        showTime: booking.showTime,
        seats: booking.seats.map((s) => s.seatNumber),
      });

      const qrCodeUrl = await QRCode.toDataURL(qrData);
      booking.qrCode = qrCodeUrl;

      await booking.save();

      // Confirm ghế trong schedule
      const schedule = await Schedule.findById(booking.schedule);
      await schedule.confirmSeats(
        booking.seats.map((s) => s.seatNumber),
        booking._id
      );

      // Broadcast qua WebSocket
      websocketService.emitToSchedule(booking.schedule.toString(), "seats-status-changed", {
        scheduleId: booking.schedule,
        seatAvailability: schedule.seatAvailability,
        action: "booked",
        seatNumbers: booking.seats.map((s) => s.seatNumber),
      });

      // Cộng loyalty points cho customer
      const customer = await User.findById(booking.customer);
      const pointsEarned = Math.floor(booking.totalAmount / 10000); // 1 điểm / 10k
      customer.loyaltyPoints += pointsEarned;

      // Tự động nâng hạng membership
      const oldLevel = customer.membershipLevel;
      if (customer.loyaltyPoints >= 1000 && customer.membershipLevel === "Bạc") {
        customer.membershipLevel = "Vàng";
      } else if (customer.loyaltyPoints >= 5000 && customer.membershipLevel === "Vàng") {
        customer.membershipLevel = "Bạch kim";
      }

      await customer.save();

      // ============================================
      // GỬI EMAIL CONFIRMATION
      // ============================================
      try {
        await emailService.sendBookingConfirmation(booking, customer);
      } catch (emailError) {
        console.error("Send email error:", emailError);
        // Không fail transaction nếu email lỗi
      }

      // ============================================
      // GỬI SMS CONFIRMATION
      // ============================================
      if (customer.phoneNumber) {
        try {
          await smsService.sendBookingConfirmation(customer.phoneNumber, booking);
        } catch (smsError) {
          console.error("Send SMS error:", smsError);
        }
      }

      // ============================================
      // TẠO NOTIFICATION
      // ============================================
      await Notification.createNotification({
        user: customer._id,
        ...Notification.templates.bookingSuccess(booking),
      });

      // Notification nếu nâng hạng
      if (oldLevel !== customer.membershipLevel) {
        await Notification.createNotification({
          user: customer._id,
          ...Notification.templates.membershipUpgrade(customer.membershipLevel),
        });
      }

      // ============================================
      // XÓA CACHE LIÊN QUAN
      // ============================================
      await redisService.del(`booking:temp:${bookingId}`);
      await redisService.invalidateScheduleCache(booking.schedule.toString());

      return successResponse(
        res,
        {
          booking,
          pointsEarned,
          newMembershipLevel: customer.membershipLevel,
          upgraded: oldLevel !== customer.membershipLevel,
        },
        "Thanh toán thành công"
      );
    } catch (error) {
      console.error("Confirm payment error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy danh sách booking của user
  getMyBookings: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      const query = { customer: req.userId };
      if (status) {
        query.status = status;
      }

      // Try cache first
      const cacheKey = `bookings:user:${req.userId}:${page}:${limit}:${status || "all"}`;
      const cachedData = await redisService.get(cacheKey);

      if (cachedData) {
        return successResponse(res, cachedData, "Success");
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
        Booking.countDocuments(query),
      ]);

      const result = {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      };

      // Cache for 5 minutes
      await redisService.set(cacheKey, result, 300);

      return successResponse(res, result);
    } catch (error) {
      console.error("Get my bookings error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy chi tiết booking
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findById(id)
        .populate("appliedVoucher", "code description discountValue")
        .populate("products.product", "name category")
        .lean();

      if (!booking) {
        return errorResponse(res, "Không tìm thấy đơn đặt vé", 404);
      }

      // Kiểm tra quyền truy cập
      if (booking.customer.toString() !== req.userId && req.userRole !== "admin") {
        return errorResponse(res, "Bạn không có quyền xem đơn đặt vé này", 403);
      }

      return successResponse(res, booking);
    } catch (error) {
      console.error("Get booking by id error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Hủy booking
  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        return errorResponse(res, "Không tìm thấy đơn đặt vé", 404);
      }

      // Kiểm tra quyền
      if (booking.customer.toString() !== req.userId && req.userRole !== "admin") {
        return errorResponse(res, "Bạn không có quyền hủy đơn đặt vé này", 403);
      }

      // Kiểm tra có thể hủy không
      if (!booking.canBeCancelled()) {
        return errorResponse(res, "Không thể hủy vé này (phải hủy trước 24h)", 400);
      }

      // Tính refund
      const refundAmount = booking.calculateRefund();

      // Cập nhật booking
      booking.status = "Đã hủy";
      booking.cancelledBy = req.userId;
      booking.cancelledAt = new Date();
      booking.cancellationReason = reason;
      booking.refundAmount = refundAmount;
      await booking.save();

      // Release ghế trong schedule
      const schedule = await Schedule.findById(booking.schedule);
      await schedule.releaseSeats(booking.seats.map((s) => s.seatNumber));

      // Broadcast qua WebSocket
      websocketService.emitToSchedule(booking.schedule.toString(), "seats-status-changed", {
        scheduleId: booking.schedule,
        seatAvailability: schedule.seatAvailability,
        action: "released",
        seatNumbers: booking.seats.map((s) => s.seatNumber),
      });

      // Hoàn voucher usage count
      if (booking.appliedVoucher) {
        await Voucher.findByIdAndUpdate(booking.appliedVoucher, { $inc: { usageCount: -1 } });
      }

      // Get customer info
      const customer = await User.findById(booking.customer);

      // ============================================
      // GỬI EMAIL CANCELLATION
      // ============================================
      try {
        await emailService.sendCancellationEmail(booking, customer, refundAmount);
      } catch (emailError) {
        console.error("Send cancellation email error:", emailError);
      }

      // ============================================
      // GỬI SMS CANCELLATION
      // ============================================
      if (customer.phoneNumber) {
        try {
          await smsService.sendCancellationNotification(customer.phoneNumber, booking, refundAmount);
        } catch (smsError) {
          console.error("Send cancellation SMS error:", smsError);
        }
      }

      // ============================================
      // TẠO NOTIFICATION
      // ============================================
      await Notification.createNotification({
        user: customer._id,
        ...Notification.templates.bookingCancelled(booking),
      });

      // ============================================
      // XÓA CACHE
      // ============================================
      await redisService.invalidateScheduleCache(booking.schedule.toString());
      await redisService.delPattern(`bookings:user:${booking.customer}:*`);

      // TODO: Xử lý hoàn tiền qua payment gateway

      return successResponse(
        res,
        {
          bookingId: booking._id,
          refundAmount,
          refundNote:
            refundAmount === booking.totalAmount
              ? "Hoàn 100% giá trị vé"
              : `Hoàn ${((refundAmount / booking.totalAmount) * 100).toFixed(0)}% giá trị vé`,
        },
        "Hủy vé thành công"
      );
    } catch (error) {
      console.error("Cancel booking error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Get all bookings (Admin)
  getAllBookings: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, search } = req.query;
      const skip = (page - 1) * limit;

      const query = {};
      if (status) {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { bookingCode: { $regex: search, $options: "i" } },
          { movieTitle: { $regex: search, $options: "i" } },
        ];
      }

      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate("customer", "fullName email phoneNumber")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Booking.countDocuments(query),
      ]);

      return successResponse(res, {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get all bookings error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Check-in tại rạp (Admin/Staff)
  checkIn: async (req, res) => {
    try {
      const { bookingCode } = req.body;

      const booking = await Booking.findOne({ bookingCode: bookingCode.toUpperCase() });
      if (!booking) {
        return errorResponse(res, "Không tìm thấy vé", 404);
      }

      if (booking.status !== "Hoàn tất") {
        return errorResponse(res, "Vé chưa được thanh toán hoặc đã bị hủy", 400);
      }

      if (booking.usedAt) {
        return errorResponse(res, "Vé đã được sử dụng", 400);
      }

      // Check thời gian (không cho check-in quá sớm)
      const showDateTime = new Date(
        `${booking.showDate.toISOString().split("T")[0]} ${booking.showTime.split(" - ")[0]}`
      );
      const now = new Date();
      const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60);

      if (hoursUntilShow > 1) {
        return errorResponse(res, "Chưa đến giờ check-in (check-in trước 1h)", 400);
      }

      if (hoursUntilShow < -2) {
        return errorResponse(res, "Suất chiếu đã kết thúc", 400);
      }

      booking.usedAt = new Date();
      booking.status = "Đã sử dụng";
      await booking.save();

      return successResponse(
        res,
        {
          movieTitle: booking.movieTitle,
          showTime: booking.showTime,
          seats: booking.seats.map((s) => s.seatNumber),
          theater: booking.theaterName,
          room: booking.roomName,
        },
        "Check-in thành công"
      );
    } catch (error) {
      console.error("Check-in error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default bookingController;
