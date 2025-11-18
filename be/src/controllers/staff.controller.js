import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Schedule from "../models/schedule.model.js";
import Theater from "../models/theater.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { AuthenticationError, AuthorizationError, NotFoundError } from "../utils/errors.js";

const staffController = {
  // ============================================
  // STAFF PROFILE MANAGEMENT
  // ============================================

  // Get staff profile
  getProfile: async (req, res) => {
    try {
      const staff = await User.findById(req.userId)
        .select("-password")
        .populate("staffInfo.assignedTheater", "name address city");

      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể truy cập");
      }

      return successResponse(res, { staff }, "Lấy thông tin nhân viên thành công");
    } catch (error) {
      console.error("Get staff profile error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Update staff profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, phoneNumber, profilePicture } = req.body;

      const staff = await User.findById(req.userId);
      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể cập nhật");
      }

      if (fullName) staff.fullName = fullName;
      if (phoneNumber) staff.phoneNumber = phoneNumber;
      if (profilePicture) staff.profilePicture = profilePicture;

      await staff.save();

      return successResponse(res, { staff }, "Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Update staff profile error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // Get assigned theater info
  getAssignedTheater: async (req, res) => {
    try {
      const staff = await User.findById(req.userId).populate("staffInfo.assignedTheater");

      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể truy cập");
      }

      if (!staff.staffInfo?.assignedTheater) {
        throw new NotFoundError("Chưa được phân công rạp");
      }

      return successResponse(res, { theater: staff.staffInfo.assignedTheater }, "Lấy thông tin rạp thành công");
    } catch (error) {
      console.error("Get assigned theater error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // ============================================
  // STAFF DASHBOARD
  // ============================================

  // Get staff dashboard data
  getDashboard: async (req, res) => {
    try {
      const staff = await User.findById(req.userId).populate("staffInfo.assignedTheater");

      if (!staff || staff.role !== "staff") {
        throw new AuthorizationError("Chỉ nhân viên mới có thể truy cập");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's bookings at assigned theater
      const todayBookings = await Booking.countDocuments({
        theaterName: staff.staffInfo?.assignedTheater?.name,
        createdAt: { $gte: today },
        status: { $in: ["Hoàn tất", "Chờ thanh toán"] },
      });

      // Get today's revenue
      const todayRevenue = await Booking.aggregate([
        {
          $match: {
            theaterName: staff.staffInfo?.assignedTheater?.name,
            createdAt: { $gte: today },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      // Get today's schedules
      const todaySchedules = await Schedule.countDocuments({
        theater: staff.staffInfo?.assignedTheater?._id,
        showDate: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      const dashboardData = {
        staff: {
          name: staff.fullName,
          position: staff.staffInfo?.position,
          shift: staff.staffInfo?.shift,
          theater: staff.staffInfo?.assignedTheater?.name,
        },
        today: {
          bookings: todayBookings,
          revenue: todayRevenue[0]?.total || 0,
          schedules: todaySchedules,
        },
      };

      return successResponse(res, dashboardData, "Lấy dashboard thành công");
    } catch (error) {
      console.error("Get staff dashboard error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },

  // ============================================
  // STAFF PERMISSIONS CHECK
  // ============================================

  // Check if staff has specific permission
  hasPermission: async (req, res) => {
    try {
      const { permission } = req.params;

      const staff = await User.findById(req.userId);
      if (!staff || staff.role !== "staff") {
        return successResponse(res, { hasPermission: false });
      }

      const hasPermission =
        staff.staffInfo?.permissions?.includes(permission) ||
        staff.staffInfo?.position === "manager" ||
        staff.staffInfo?.position === "supervisor";

      return successResponse(res, { hasPermission });
    } catch (error) {
      console.error("Check permission error:", error);
      return errorResponse(res, error.message || "Lỗi server", error.statusCode || 500);
    }
  },
};

export default staffController;
