import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User là bắt buộc"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
      maxlength: [100, "Tiêu đề không được quá 100 ký tự"],
    },
    message: {
      type: String,
      required: [true, "Nội dung là bắt buộc"],
      trim: true,
      maxlength: [500, "Nội dung không được quá 500 ký tự"],
    },
    type: {
      type: String,
      enum: {
        values: [
          "booking_success", // Đặt vé thành công
          "booking_cancelled", // Vé bị hủy
          "payment_success", // Thanh toán thành công
          "payment_failed", // Thanh toán thất bại
          "reminder", // Nhắc nhở suất chiếu
          "promotion", // Khuyến mãi
          "system_update", // Cập nhật hệ thống
          "review_approved", // Đánh giá được duyệt
          "review_rejected", // Đánh giá bị từ chối
          "loyalty_points", // Tích điểm
          "membership_upgrade", // Nâng hạng thành viên
        ],
        message: "{VALUE} không phải là loại thông báo hợp lệ",
      },
      required: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,
    link: {
      type: String,
      validate: {
        validator: function (url) {
          return !url || /^\//.test(url) || /^https?:\/\/.+/.test(url);
        },
        message: "Link không hợp lệ",
      },
    },
    // Related data
    relatedModel: {
      type: String,
      enum: ["Booking", "Movie", "Review", "User", null],
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
    // Additional data
    metadata: {
      type: Schema.Types.Mixed,
    },
    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    // Expiration
    expiresAt: {
      type: Date,
      index: true,
    },
    // Delivery channels
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
    },
    // Delivery status
    deliveryStatus: {
      inApp: { type: String, enum: ["pending", "delivered", "failed"], default: "pending" },
      email: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
      sms: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// === INDEXES ===
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// === VIRTUAL FIELDS ===
notificationSchema.virtual("isExpired").get(function () {
  return this.expiresAt && this.expiresAt < new Date();
});

notificationSchema.virtual("age").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes} phút trước`;
  return "Vừa xong";
});

// === INSTANCE METHODS ===
notificationSchema.methods.markAsRead = function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

notificationSchema.methods.markAsUnread = function () {
  this.isRead = false;
  this.readAt = null;
  return this.save();
};

// === STATIC METHODS ===
notificationSchema.statics.createNotification = async function (data) {
  const notification = new this(data);
  await notification.save();

  // TODO: Send via other channels (email, SMS) if enabled
  // if (data.channels?.email) {
  //     await emailService.send(...);
  // }

  return notification;
};

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  });
};

notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
};

notificationSchema.statics.deleteOldNotifications = function (days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true,
  });
};

// === NOTIFICATION TEMPLATES ===
notificationSchema.statics.templates = {
  bookingSuccess: (booking) => ({
    title: "Đặt vé thành công",
    message: `Bạn đã đặt vé xem ${booking.movieTitle} thành công. Mã vé: ${booking.bookingCode}`,
    type: "booking_success",
    link: `/bookings/${booking._id}`,
    relatedModel: "Booking",
    relatedId: booking._id,
    priority: "high",
  }),

  bookingCancelled: (booking) => ({
    title: "Vé đã được hủy",
    message: `Vé ${booking.bookingCode} đã được hủy. Số tiền hoàn lại: ${booking.refundAmount.toLocaleString()}đ`,
    type: "booking_cancelled",
    link: `/bookings/${booking._id}`,
    relatedModel: "Booking",
    relatedId: booking._id,
    priority: "medium",
  }),

  bookingReminder: (booking) => ({
    title: "Nhắc nhở suất chiếu",
    message: `Suất chiếu "${booking.movieTitle}" của bạn sẽ bắt đầu vào ${booking.showTime}. Đừng quên check-in!`,
    type: "reminder",
    link: `/bookings/${booking._id}`,
    relatedModel: "Booking",
    relatedId: booking._id,
    priority: "high",
  }),

  paymentSuccess: (booking) => ({
    title: "Thanh toán thành công",
    message: `Thanh toán ${booking.totalAmount.toLocaleString()}đ cho vé ${booking.bookingCode} thành công`,
    type: "payment_success",
    link: `/bookings/${booking._id}`,
    relatedModel: "Booking",
    relatedId: booking._id,
    priority: "high",
  }),

  loyaltyPoints: (points, currentPoints) => ({
    title: "Tích điểm thành công",
    message: `Bạn vừa nhận được ${points} điểm. Tổng điểm hiện tại: ${currentPoints}`,
    type: "loyalty_points",
    priority: "low",
  }),

  membershipUpgrade: (newLevel) => ({
    title: "Chúc mừng nâng hạng!",
    message: `Bạn đã được nâng lên hạng ${newLevel}. Hãy tận hưởng các ưu đãi đặc biệt!`,
    type: "membership_upgrade",
    priority: "high",
  }),

  promotion: (title, description, link) => ({
    title: title,
    message: description,
    type: "promotion",
    link: link,
    priority: "medium",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  }),
};

export default mongoose.model("Notification", notificationSchema);
