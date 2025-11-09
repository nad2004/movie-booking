import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username phải có ít nhất 3 ký tự"],
      maxlength: [30, "Username không được quá 30 ký tự"],
      match: [/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và dấu gạch dưới"],
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
      index: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    fullName: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      trim: true,
      minlength: [2, "Họ tên phải có ít nhất 2 ký tự"],
      maxlength: [100, "Họ tên không được quá 100 ký tự"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
      index: true,
    },
    profilePicture: {
      type: String,
      default: "https://via.placeholder.com/200x200?text=Avatar",
    },
    cloudinaryPublicId: {
      type: String, // For deleting old images
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "admin", "super-admin"],
        message: "{VALUE} không phải là role hợp lệ",
      },
      default: "customer",
      index: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true,
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: [0, "Điểm không thể âm"],
    },
    membershipLevel: {
      type: String,
      enum: {
        values: ["Bạc", "Vàng", "Bạch kim"],
        message: "{VALUE} không phải là hạng thành viên hợp lệ",
      },
      default: "Bạc",
    },
    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: function (permissions) {
          const validPermissions = [
            "manage_movies",
            "manage_schedules",
            "manage_bookings",
            "manage_users",
            "manage_theaters",
            "view_reports",
          ];
          return permissions.every((p) => validPermissions.includes(p));
        },
        message: "Permission không hợp lệ",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// === INDEXES ===
userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ loyaltyPoints: -1 });

// === VIRTUAL FIELDS ===
userSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "customer",
});

userSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "customer",
});

userSchema.virtual("isAdmin").get(function () {
  return ["admin", "super-admin"].includes(this.role);
});

userSchema.virtual("nextMembershipLevel").get(function () {
  if (this.membershipLevel === "Bạc" && this.loyaltyPoints >= 1000) return "Vàng";
  if (this.membershipLevel === "Vàng" && this.loyaltyPoints >= 5000) return "Bạch kim";
  return this.membershipLevel;
});

// === PRE-SAVE MIDDLEWARE ===
userSchema.pre("save", async function (next) {
  // Auto-upgrade membership
  if (this.loyaltyPoints >= 5000 && this.membershipLevel !== "Bạch kim") {
    this.membershipLevel = "Bạch kim";
  } else if (this.loyaltyPoints >= 1000 && this.membershipLevel === "Bạc") {
    this.membershipLevel = "Vàng";
  }

  // Track password changes
  if (this.isModified("password")) {
    this.passwordChangedAt = new Date();
  }

  next();
});

// === INSTANCE METHODS ===
userSchema.methods.addLoyaltyPoints = function (points) {
  this.loyaltyPoints += points;
  return this.save();
};

userSchema.methods.redeemLoyaltyPoints = function (points) {
  if (this.loyaltyPoints < points) {
    throw new Error("Không đủ điểm");
  }
  this.loyaltyPoints -= points;
  return this.save();
};

userSchema.methods.hasPermission = function (permission) {
  if (this.role === "super-admin") return true;
  return this.permissions.includes(permission);
};

// === STATIC METHODS ===
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.getTopCustomers = function (limit = 10) {
  return this.find({ role: "customer", isActive: true })
    .sort({ loyaltyPoints: -1 })
    .limit(limit)
    .select("fullName email loyaltyPoints membershipLevel");
};

export default mongoose.model("User", userSchema);
