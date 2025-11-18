import counterBookingService from "../services/counter-booking.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { AuthorizationError } from "../utils/errors.js";
import User from "../models/user.model.js";

const counterBookingController = {
  // Create booking at counter
  createBooking: async (req, res) => {
    try {
      // Verify staff role
      const staff = await User.findById(req.userId);
      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể tạo booking tại quầy");
      }

      const result = await counterBookingService.createCounterBooking(req.userId, req.body);

      return successResponse(res, result, "Tạo booking tại quầy thành công", 201);
    } catch (error) {
      console.error("Create counter booking error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Get staff's transactions
  getMyTransactions: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const transactions = await counterBookingService.getStaffTransactions(req.userId, start, end);

      return successResponse(res, { transactions }, "Lấy danh sách giao dịch thành công");
    } catch (error) {
      console.error("Get staff transactions error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Get theater's transactions (for supervisors)
  getTheaterTransactions: async (req, res) => {
    try {
      const staff = await User.findById(req.userId);

      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể truy cập");
      }

      if (!["supervisor", "manager"].includes(staff.staffInfo?.position)) {
        throw new AuthorizationError("Chỉ supervisor/manager mới có thể xem tất cả giao dịch");
      }

      const { date } = req.query;
      const queryDate = date ? new Date(date) : new Date();

      const transactions = await counterBookingService.getTheaterTransactions(
        staff.staffInfo.assignedTheater,
        queryDate
      );

      return successResponse(res, { transactions }, "Lấy danh sách giao dịch thành công");
    } catch (error) {
      console.error("Get theater transactions error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },
};

export default counterBookingController;
