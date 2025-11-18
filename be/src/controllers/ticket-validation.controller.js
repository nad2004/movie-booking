import Booking from "../models/booking.model.js";
import EntryLog from "../models/entry-log.model.js";
import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { AuthorizationError, NotFoundError } from "../utils/errors.js";

const ticketValidationController = {
  // Validate ticket by booking code
  validateByBookingCode: async (req, res) => {
    try {
      const { bookingCode } = req.body;

      // Verify staff
      const staff = await User.findById(req.userId);
      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể xác thực vé");
      }

      // Find booking
      const booking = await Booking.findOne({ bookingCode })
        .populate("customer", "fullName email phoneNumber")
        .populate("schedule");

      if (!booking) {
        throw new NotFoundError("Không tìm thấy booking");
      }

      // Validate booking status
      if (booking.status !== "Hoàn tất") {
        return errorResponse(res, "Vé chưa được thanh toán hoặc đã bị hủy", 400);
      }

      // Check if already used
      const existingEntry = await EntryLog.checkDuplicateEntry(booking._id);

      if (existingEntry) {
        // Create duplicate entry log
        const duplicateLog = new EntryLog({
          booking: booking._id,
          bookingCode: booking.bookingCode,
          customer: booking.customer._id,
          customerName: booking.customer.fullName,
          movie: booking.movieTitle,
          theater: staff.staffInfo?.assignedTheater,
          theaterName: booking.theaterName,
          schedule: booking.schedule,
          showDate: booking.showDate,
          showTime: booking.showTime,
          seats: booking.seats,
          validatedBy: staff._id,
          validatedByName: staff.fullName,
          validationMethod: "booking_code",
          entryStatus: "duplicate",
          isDuplicate: true,
          previousEntryAt: existingEntry.validatedAt,
          notes: "Vé đã được sử dụng trước đó",
        });

        await duplicateLog.save();

        return errorResponse(res, `Vé đã được sử dụng lúc ${existingEntry.validatedAt.toLocaleString("vi-VN")}`, 400);
      }

      // Check show time
      const now = new Date();
      const showDate = new Date(booking.showDate);
      const [startTime] = booking.showTime.split(" - ");
      const [hours, minutes] = startTime.split(":");
      showDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Allow entry 30 minutes before show time
      const allowEntryTime = new Date(showDate.getTime() - 30 * 60 * 1000);

      if (now < allowEntryTime) {
        return errorResponse(
          res,
          `Chưa đến giờ vào rạp. Vui lòng quay lại sau ${allowEntryTime.toLocaleTimeString("vi-VN")}`,
          400
        );
      }

      // Create entry log
      const entryLog = new EntryLog({
        booking: booking._id,
        bookingCode: booking.bookingCode,
        customer: booking.customer._id,
        customerName: booking.customer.fullName,
        movie: booking.movieTitle,
        theater: staff.staffInfo?.assignedTheater,
        theaterName: booking.theaterName,
        schedule: booking.schedule,
        showDate: booking.showDate,
        showTime: booking.showTime,
        seats: booking.seats,
        validatedBy: staff._id,
        validatedByName: staff.fullName,
        validationMethod: "booking_code",
        entryStatus: "allowed",
      });

      await entryLog.save();

      // Update booking
      booking.usedAt = new Date();
      booking.status = "Đã sử dụng";
      await booking.save();

      return successResponse(
        res,
        {
          entryLog,
          booking: {
            bookingCode: booking.bookingCode,
            customerName: booking.customer.fullName,
            movieTitle: booking.movieTitle,
            showTime: booking.showTime,
            seats: booking.seats.map((s) => s.seatNumber),
            roomName: booking.roomName,
          },
        },
        "Xác thực vé thành công"
      );
    } catch (error) {
      console.error("Validate ticket error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Validate ticket by QR code data
  validateByQRCode: async (req, res) => {
    try {
      const { qrData } = req.body;

      // Verify staff
      const staff = await User.findById(req.userId);
      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể xác thực vé");
      }

      // Parse QR data
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
      } catch (error) {
        return errorResponse(res, "Mã QR không hợp lệ", 400);
      }

      const { bookingCode } = parsedData;

      // Reuse booking code validation logic
      req.body.bookingCode = bookingCode;
      return await ticketValidationController.validateByBookingCode(req, res);
    } catch (error) {
      console.error("Validate QR code error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Get entry logs for staff
  getMyValidations: async (req, res) => {
    try {
      const { date } = req.query;
      const queryDate = date ? new Date(date) : new Date();

      const validations = await EntryLog.getStaffValidations(req.userId, queryDate);

      return successResponse(res, { validations }, "Lấy danh sách xác thực thành công");
    } catch (error) {
      console.error("Get staff validations error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Get entry logs for theater (supervisor only)
  getTheaterEntries: async (req, res) => {
    try {
      const staff = await User.findById(req.userId);

      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể truy cập");
      }

      if (!["supervisor", "manager"].includes(staff.staffInfo?.position)) {
        throw new AuthorizationError("Chỉ supervisor/manager mới có thể xem tất cả entry logs");
      }

      const { date } = req.query;
      const queryDate = date ? new Date(date) : new Date();

      const entries = await EntryLog.getTheaterEntries(staff.staffInfo.assignedTheater, queryDate);

      return successResponse(res, { entries }, "Lấy danh sách entry logs thành công");
    } catch (error) {
      console.error("Get theater entries error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Check ticket status without validating
  checkTicketStatus: async (req, res) => {
    try {
      const { bookingCode } = req.params;

      const booking = await Booking.findOne({ bookingCode })
        .select("bookingCode status movieTitle showTime showDate seats roomName customer")
        .populate("customer", "fullName phoneNumber");

      if (!booking) {
        throw new NotFoundError("Không tìm thấy booking");
      }

      const existingEntry = await EntryLog.checkDuplicateEntry(booking._id);

      return successResponse(res, {
        booking: {
          bookingCode: booking.bookingCode,
          status: booking.status,
          movieTitle: booking.movieTitle,
          showTime: booking.showTime,
          showDate: booking.showDate,
          seats: booking.seats.map((s) => s.seatNumber),
          roomName: booking.roomName,
          customerName: booking.customer?.fullName,
        },
        isUsed: !!existingEntry,
        usedAt: existingEntry?.validatedAt,
      });
    } catch (error) {
      console.error("Check ticket status error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },
};

export default ticketValidationController;
