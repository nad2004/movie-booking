import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const userController = {
  // Cập nhật profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, phoneNumber, profilePicture } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      if (fullName) user.fullName = fullName;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (profilePicture) user.profilePicture = profilePicture;

      await user.save();

      return successResponse(res, user, "Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Update profile error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy điểm loyalty
  getLoyaltyPoints: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("loyaltyPoints membershipLevel");

      return successResponse(res, {
        loyaltyPoints: user.loyaltyPoints,
        membershipLevel: user.membershipLevel,
      });
    } catch (error) {
      console.error("Get loyalty points error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy tất cả users (Admin)
  getAllUsers: async (req, res) => {
    try {
      const { role, page = 1, limit = 20, search } = req.query;

      const query = {};
      if (role) query.role = role;
      if (search) {
        query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
        User.countDocuments(query),
      ]);

      return successResponse(res, {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy chi tiết user (Admin)
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select("-password").lean();
      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      return successResponse(res, user);
    } catch (error) {
      console.error("Get user by id error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Cập nhật role user (Super Admin)
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, permissions } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      if (role) user.role = role;
      if (permissions) user.permissions = permissions;

      await user.save();

      return successResponse(res, user, "Cập nhật role thành công");
    } catch (error) {
      console.error("Update user role error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Xóa user (Super Admin)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Không cho xóa chính mình
      if (id === req.userId) {
        return errorResponse(res, "Không thể xóa chính mình", 400);
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      return successResponse(res, {}, "Xóa người dùng thành công");
    } catch (error) {
      console.error("Delete user error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default userController;
