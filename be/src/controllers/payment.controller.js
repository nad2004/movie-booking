import Booking from "../models/booking.model.js";
import vnpayService from "../services/payment/vnpay.service.js";
import momoService from "../services/payment/momo.service.js";
import emailService from "../services/email.service.js";
import smsService from "../services/sms.service.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const paymentController = {
  // ============================================
  // VNPAY
  // ============================================

  // Tạo payment URL VNPay
  createVNPayPayment: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, "Không tìm thấy đơn đặt vé", 404);
      }

      // Verify ownership
      if (booking.customer.toString() !== req.userId) {
        return errorResponse(res, "Bạn không có quyền thanh toán đơn này", 403);
      }

      if (booking.status !== "Chờ thanh toán") {
        return errorResponse(res, "Đơn đặt vé không ở trạng thái chờ thanh toán", 400);
      }

      // Create payment URL
      const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;

      const result = vnpayService.createPaymentUrl(booking, ipAddr);

      if (result.success) {
        // Update booking với orderId
        booking.paymentDetails.transactionId = result.orderId;
        await booking.save();

        return successResponse(res, {
          paymentUrl: result.paymentUrl,
          orderId: result.orderId,
        });
      } else {
        return errorResponse(res, "Không thể tạo payment URL", 500);
      }
    } catch (error) {
      console.error("Create VNPay payment error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // VNPay return URL
  handleVNPayReturn: async (req, res) => {
    try {
      const vnpParams = req.query;

      // Verify signature
      const result = vnpayService.verifyReturnUrl(vnpParams);

      if (!result.verified) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Invalid signature`);
      }

      // Extract booking code from orderId
      const bookingCode = result.orderId.split("_")[0];
      const booking = await Booking.findOne({ bookingCode });

      if (!booking) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Booking not found`);
      }

      if (result.isSuccess) {
        // Update booking status
        booking.status = "Hoàn tất";
        booking.paymentDetails = {
          paymentMethod: "VNPAY",
          transactionId: result.transactionNo,
          status: "Thành công",
          amount: result.amount,
          paymentDate: new Date(),
          paymentInfo: `Bank: ${result.bankCode}`,
        };
        await booking.save();

        // Get customer
        const customer = await User.findById(booking.customer);

        // Send notifications (không chờ)
        Promise.all([
          emailService.sendBookingConfirmation(booking, customer),
          customer.phoneNumber ? smsService.sendBookingConfirmation(customer.phoneNumber, booking) : null,
          Notification.createNotification({
            user: customer._id,
            ...Notification.templates.paymentSuccess(booking),
          }),
        ]).catch((err) => console.error("Notification error:", err));

        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?bookingId=${booking._id}`);
      } else {
        // Payment failed
        booking.status = "Đã hủy";
        booking.paymentDetails.status = "Thất bại";
        await booking.save();

        const message = vnpayService.getResponseMessage(result.responseCode);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=${encodeURIComponent(message)}`);
      }
    } catch (error) {
      console.error("VNPay return handler error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=System error`);
    }
  },

  // VNPay IPN (Instant Payment Notification)
  handleVNPayIPN: async (req, res) => {
    try {
      const vnpParams = req.query;

      const result = vnpayService.verifyIpn(vnpParams);

      // Return response to VNPay
      res.json(result);

      // Process payment in background
      if (result.RspCode === "00") {
        const orderId = vnpParams["vnp_TxnRef"];
        const bookingCode = orderId.split("_")[0];
        const booking = await Booking.findOne({ bookingCode });

        if (booking && booking.status === "Chờ thanh toán") {
          // Update booking (similar to return handler)
          // ... (implementation)
        }
      }
    } catch (error) {
      console.error("VNPay IPN error:", error);
      res.json({
        RspCode: "99",
        Message: "Unknown error",
      });
    }
  },

  // ============================================
  // MOMO
  // ============================================

  // Tạo payment MoMo
  createMoMoPayment: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, "Không tìm thấy đơn đặt vé", 404);
      }

      // Verify ownership
      if (booking.customer.toString() !== req.userId) {
        return errorResponse(res, "Bạn không có quyền thanh toán đơn này", 403);
      }

      if (booking.status !== "Chờ thanh toán") {
        return errorResponse(res, "Đơn đặt vé không ở trạng thái chờ thanh toán", 400);
      }

      // Create payment
      const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

      const result = await momoService.createPayment(booking, ipAddr);

      if (result.success) {
        // Update booking
        booking.paymentDetails.transactionId = result.orderId;
        await booking.save();

        return successResponse(res, {
          paymentUrl: result.paymentUrl,
          deeplink: result.deeplink, // For mobile app
          qrCodeUrl: result.qrCodeUrl, // For scan
          orderId: result.orderId,
          requestId: result.requestId,
        });
      } else {
        return errorResponse(res, 'Không thể tạo payment MoMo', 500);
      }
    } catch (error) {
      console.error("Create MoMo payment error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // MoMo return URL
  handleMoMoReturn: async (req, res) => {
    try {
      const momoData = req.query;

      // Verify signature
      const result = momoService.verifySignature(momoData);

      if (!result.verified) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Invalid signature`);
      }

      const bookingCode = result.orderId.split("_")[0];
      const booking = await Booking.findOne({ bookingCode });

      if (!booking) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=Booking not found`);
      }

      if (result.isSuccess) {
        // Update booking
        booking.status = "Hoàn tất";
        booking.paymentDetails = {
          paymentMethod: "MoMo",
          transactionId: result.transId,
          status: "Thành công",
          amount: result.amount,
          paymentDate: new Date(),
          paymentInfo: result.message,
        };
        await booking.save();

        // Get customer
        const customer = await User.findById(booking.customer);

        // Send notifications
        Promise.all([
          emailService.sendBookingConfirmation(booking, customer),
          customer.phoneNumber ? smsService.sendBookingConfirmation(customer.phoneNumber, booking) : null,
          Notification.createNotification({
            user: customer._id,
            ...Notification.templates.paymentSuccess(booking),
          }),
        ]).catch((err) => console.error("Notification error:", err));

        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?bookingId=${booking._id}`);
      } else {
        // Payment failed
        booking.status = "Đã hủy";
        booking.paymentDetails.status = "Thất bại";
        await booking.save();

        const message = momoService.getResultMessage(result.resultCode);
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=${encodeURIComponent(message)}`);
      }
    } catch (error) {
      console.error("MoMo return handler error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?message=System error`);
    }
  },

  // MoMo IPN (notify)
  handleMoMoNotify: async (req, res) => {
    try {
      const momoData = req.body;

      const result = momoService.verifySignature(momoData);

      if (result.verified) {
        // Return success to MoMo
        res.json({
          resultCode: 0,
          message: "Success",
        });

        // Process in background
        if (result.isSuccess) {
          const bookingCode = result.orderId.split("_")[0];
          const booking = await Booking.findOne({ bookingCode });

          if (booking && booking.status === "Chờ thanh toán") {
            // Update booking
            booking.status = "Hoàn tất";
            booking.paymentDetails.status = "Thành công";
            booking.paymentDetails.transactionId = result.transId;
            await booking.save();
          }
        }
      } else {
        res.json({
          resultCode: 97,
          message: "Invalid signature",
        });
      }
    } catch (error) {
      console.error("MoMo notify error:", error);
      res.json({
        resultCode: 99,
        message: "Unknown error",
      });
    }
  },

  // ============================================
  // QUERY & REFUND
  // ============================================

  // Query payment status
  queryPaymentStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, "Không tìm thấy đơn đặt vé", 404);
      }

      // Query based on payment method
      let result;
      if (booking.paymentDetails.paymentMethod === "VNPAY") {
        result = await vnpayService.queryTransaction(
          booking.paymentDetails.transactionId,
          booking.paymentDetails.paymentDate
        );
      } else if (booking.paymentDetails.paymentMethod === "MoMo") {
        result = await momoService.queryTransaction(booking.paymentDetails.transactionId, booking.bookingCode);
      }

      return successResponse(res, result);
    } catch (error) {
      console.error("Query payment status error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Refund payment
  refundPayment: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, "Không tìm thấy đơn đặt vé", 404);
      }

      if (booking.status !== "Đã hủy") {
        return errorResponse(res, 'Chỉ có thể hoàn tiền cho vé đã hủy', 400);
      }

      // Refund based on payment method
      let result;
      if (booking.paymentDetails.paymentMethod === "VNPAY") {
        result = await vnpayService.refundTransaction(
          booking.paymentDetails.transactionId,
          booking.refundAmount,
          booking.paymentDetails.paymentDate,
          req.userId
        );
      } else if (booking.paymentDetails.paymentMethod === "MoMo") {
        result = await momoService.refundTransaction(
          booking.bookingCode,
          booking.paymentDetails.transactionId,
          booking.refundAmount,
          "Hoàn tiền hủy vé"
        );
      }

      if (result.success) {
        // Update booking
        booking.paymentDetails.status = "Đã hoàn tiền";
        await booking.save();

        return successResponse(res, result, 'Hoàn tiền thành công');
      } else {
        return errorResponse(res, 'Hoàn tiền thất bại', 500);
      }
    } catch (error) {
      console.error("Refund payment error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default paymentController;
