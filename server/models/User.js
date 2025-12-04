const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function() { return !this.googleId; }, // Required only if not Google OAuth
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    phoneNumber: {
      type: String,
      default: null,
      match: [/^[6-9]\d{9}$/, "Please provide a valid Indian phone number"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ========== GOOGLE OAUTH ==========
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true, // Allows multiple nulls but uniqueness for non-nulls
    },

    // ========== EMAIL VERIFICATION ==========
    isEmailVerified: {
      type: Boolean,
      default: function() { return !!this.googleId; }, // Auto-verified for Google users
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },

    // ========== PASSWORD RESET ==========
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },

    // ========== REFRESH TOKENS (For Token Rotation) ==========
    refreshTokens: [
      {
        type: String,
      },
    ],

    // ========== USER PROFILE ==========
    firstName: {
      type: String,
      default: null,
      trim: true,
    },
    lastName: {
      type: String,
      default: null,
      trim: true,
    },
    profilePicture: { // For Google profile picture
      type: String,
      default: null,
    },
    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
          type: String,
          enum: ["home", "work", "other"],
          default: "home",
        },
        fullName: String,
        phoneNumber: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: {
          type: String,
          default: "India",
        },
        isDefault: Boolean,
      },
    ],

    // ========== PREFERENCES ==========
    preferredContactMethod: {
      type: String,
      enum: ["email", "whatsapp", "sms"],
      default: "email",
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // ========== ACCOUNT STATUS ==========
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },

    // ========== TIMESTAMPS ==========
  },
  { timestamps: true }
);

// ========== INDEXES ==========

userSchema.index({ resetTokenExpiry: 1 }, { expireAfterSeconds: 3600 });
userSchema.index({ verificationTokenExpiry: 1 }, { expireAfterSeconds: 86400 });
userSchema.index({ googleId: 1 }, { sparse: true });

// ========== METHODS ==========

// Get full name
userSchema.methods.getFullName = function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
};

// Check if account is locked (for brute force protection)
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts
userSchema.methods.incLoginAttempts = async function () {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  // Increment attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 attempts for 30 minutes
  const maxAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Clear refresh tokens
userSchema.methods.clearRefreshTokens = async function () {
  return await this.updateOne({ $set: { refreshTokens: [] } });
};

// Add default address
userSchema.methods.addAddress = function (address) {
  // If this is the first address or marked as default, make it default
  if (this.addresses.length === 0 || address.isDefault) {
    // Remove default from all other addresses
    this.addresses.forEach((addr) => (addr.isDefault = false));
    address.isDefault = true;
  }

  this.addresses.push({
    _id: new mongoose.Types.ObjectId(),
    ...address,
  });

  return this.save();
};

// Update default address
userSchema.methods.setDefaultAddress = function (addressId) {
  this.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === addressId.toString();
  });
  return this.save();
};

// Get default address
userSchema.methods.getDefaultAddress = function () {
  return this.addresses.find((addr) => addr.isDefault);
};

// Check if user is OAuth user
userSchema.methods.isOAuthUser = function () {
  return !!this.googleId;
};

module.exports = mongoose.model("User", userSchema);