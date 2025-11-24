import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import { generateAuthToken, generatePasswordResetToken } from "../helpers/generateToken.js";

const authController = {
  // Đăng ký tài khoản mới
  register: async (req, res) => {
    try {
      const { username, email, password, fullName, phoneNumber } = req.body;

      // Validate input
      if (!email || !password || !fullName) {
        return errorResponse(res, "Email, mật khẩu và họ tên là bắt buộc", 400);
      }

      // Validate password strength
      if (password.length < 6) {
        return errorResponse(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
      }

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return errorResponse(res, "Email đã được sử dụng", 400);
      }

      // Kiểm tra username đã tồn tại (nếu có)
      if (username) {
        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
          return errorResponse(res, "Username đã được sử dụng", 400);
        }
      }

      // Không hash ở đây, để model pre-save hook xử lý
      // Tạo user mới
      const newUser = new User({
        username: username?.toLowerCase(),
        email: email.toLowerCase(),
        password: password, // Plain password, sẽ được hash trong pre-save hook
        fullName,
        phoneNumber,
        authProvider: "local",
        role: "customer",
      });

      await newUser.save(); // Pre-save hook sẽ hash password

      // Tạo token
      // const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const token = generateAuthToken(newUser);

      const data = {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      };

      return successResponse(res, data, "Đăng ký thành công", 201);
    } catch (error) {
      console.error("Register error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return errorResponse(res, "Email và mật khẩu là bắt buộc", 400);
      }

      // Tìm user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return errorResponse(res, "Email hoặc mật khẩu không đúng", 401);
      }

      // Kiểm tra auth provider
      if (user.authProvider !== "local") {
        return errorResponse(res, `Tài khoản này đăng nhập bằng ${user.authProvider}`, 400);
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return errorResponse(res, "Email hoặc mật khẩu không đúng", 401);
      }

      // Tạo token
      // const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const token = generateAuthToken(user);

      const data = {
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          profilePicture: user.profilePicture,
          loyaltyPoints: user.loyaltyPoints,
          membershipLevel: user.membershipLevel,
        },
      };

      return successResponse(res, data, "Đăng nhập thành công");
    } catch (error) {
      console.error("Login error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },

  // Đăng nhập bằng   ogle
  googleLogin: async (req, res) => {
    try {
      const { googleId, email, fullName, profilePicture } = req.body;

      if (!googleId || !email) {
        return errorResponse(res, "Thông tin Google không hợp lệ", 400);
      }

      // Tìm hoặc tạo user
      let user = await User.findOne({
        $or: [{ googleId }, { email: email.toLowerCase() }],
      });

      if (user) {
        // Cập nhật googleId nếu chưa có
        if (!user.googleId) {
          user.googleId = googleId;
          user.authProvider = "google";
          await user.save();
        }
      } else {
        // Tạo user mới
        user = new User({
          googleId,
          email: email.toLowerCase(),
          fullName,
          profilePicture: profilePicture || "default_avatar_url",
          authProvider: "google",
          role: "customer",
        });
        await user.save();
      }

      // Tạo token
      // const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const token = generateAuthToken(user);

      const data = {
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          profilePicture: user.profilePicture,
          loyaltyPoints: user.loyaltyPoints,
          membershipLevel: user.membershipLevel,
        },
      };

      return successResponse(res, data, "Đăng nhập Google thành công");
    } catch (error) {
      console.error("Google login error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      return successResponse(res, user, "Lấy thông tin người dùng thành công");
    } catch (error) {
      console.error("Get current user error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return errorResponse(res, "Vui lòng nhập đầy đủ thông tin", 400);
      }

      if (newPassword.length < 6) {
        return errorResponse(res, "Mật khẩu mới phải có ít nhất 6 ký tự", 400);
      }

      const user = await User.findById(req.userId);

      if (user.authProvider !== "local") {
        return errorResponse(res, "Tài khoản Google không thể đổi mật khẩu", 400);
      }

      // Kiểm tra mật khẩu cũ
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return errorResponse(res, "Mật khẩu cũ không đúng", 401);
      }

      //    Không hash ở đây, để pre-save hook xử lý
      user.password = newPassword; //  Plain password
      await user.save(); //  Pre-save hook sẽ hash

      return successResponse(res, {}, "Đổi mật khẩu thành công");
    } catch (error) {
      console.error("Change password error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },

  // Quên mật khẩu (gửi email reset)
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return errorResponse(res, "Email không tồn tại trong hệ thống", 404);
      }

      if (user.authProvider !== "local") {
        return errorResponse(res, "Tài khoản Google không cần reset mật khẩu", 400);
      }

      // Tạo reset token
      const resetToken = generatePasswordResetToken(user._id);

      //  : Gửi email với link reset
      const emailService = (await import("../services/email.service.js")).default;
      const emailResult = await emailService.sendPasswordResetEmail(user, resetToken);

      if (!emailResult.success) {
        console.error("Failed to send password reset email:", emailResult.error);
        // Không fail request nếu email gửi lỗi, chỉ log
      } else {
        console.log(` Password reset email sent successfully to ${user.email}`);
      }

      //  DEV ONLY: Log reset URL for testing
      if (process.env.NODE_ENV === "development") {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log(`🔗 Reset URL (DEV ONLY): ${resetUrl}`);
      }

      // Trong production, không nên trả về token trong response
      // Chỉ trả về thông báo đã gửi email
      return successResponse(res, {}, "Đã gửi link reset mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.");
    } catch (error) {
      console.error("Forgot password error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },

  // Reset mật khẩu
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return errorResponse(res, "Vui lòng nhập đầy đủ thông tin", 400);
      }

      if (newPassword.length < 6) {
        return errorResponse(res, "Mật khẩu mới phải có ít nhất 6 ký tự", 400);
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.purpose !== "reset-password") {
        return errorResponse(res, "Token không hợp lệ", 400);
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      //    Không hash ở đây, để pre-save hook xử lý
      user.password = newPassword; //  Plain password
      await user.save(); //  Pre-save hook sẽ hash

      return successResponse(res, {}, "Reset mật khẩu thành công");
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return errorResponse(res, "Token đã hết hạn", 400);
      }
      if (error.name === "JsonWebTokenError") {
        return errorResponse(res, "Token không hợp lệ", 400);
      }
      console.error("Reset password error:", error);
      return errorResponse(res, "Lỗi server không xác định");
    }
  },
};

export default authController;
