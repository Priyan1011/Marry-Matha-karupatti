const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const nodemailer = require("nodemailer");

// ============= CONFIGURATION =============
const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Email verification token utility
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// ============= SEND VERIFICATION EMAIL =============
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    // Configure your email service here (Gmail, SendGrid, etc.)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Karupatti Shop Account",
      html: `
        <h2>Welcome to Karupatti Shop!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background: #208080; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy and paste this link:</p>
        <p>${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
        <p>Happy shopping!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// ============= SEND PASSWORD RESET EMAIL =============
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Karupatti Shop Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background: #208080; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy and paste this link:</p>
        <p>${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// ============= GOOGLE OAUTH CALLBACK =============
const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`);
    }

    // Generate tokens for Google OAuth user
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.ACCESS_TOKEN_SECRET || "ACCESS_SECRET_KEY",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET_KEY",
      { expiresIn: "7d" }
    );

    // Store refresh token in database
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed to lax for OAuth redirects
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect(`${process.env.FRONTEND_URL}/auth/google-success`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`);
  }
};

// ============= REGISTER USER =============
const registerUser = async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  try {
    // Validation
    if (!userName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login or use another email",
      });
    }

    // Check if username is taken
    const checkUsername = await User.findOne({ userName });
    if (checkUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken. Please choose another",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();

    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      verificationToken,
      isEmailVerified: false,
      createdAt: new Date(),
    });

    await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.warn("Verification email not sent, but user registered:", emailError);
      // Don't fail registration if email sending fails
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later",
    });
  }
};

// ============= VERIFY EMAIL =============
const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again",
    });
  }
};

// ============= LOGIN USER =============
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const checkUser = await User.findOne({ email }).select("+password");
    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is Google OAuth user (no password)
    if (checkUser.googleId && !checkUser.password) {
      return res.status(403).json({
        success: false,
        message: "This email is registered with Google. Please login with Google",
      });
    }

    // Check if email is verified (only for email/password users)
    if (!checkUser.googleId && !checkUser.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first. Check your inbox for verification link",
      });
    }

    // Check password
    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.ACCESS_TOKEN_SECRET || "ACCESS_SECRET_KEY",
      { expiresIn: "15m" }
    );

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
      },
      process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET_KEY",
      { expiresIn: "7d" }
    );

    // Store refresh token in database (for token rotation)
    checkUser.refreshTokens = checkUser.refreshTokens || [];
    checkUser.refreshTokens.push(refreshToken);
    await checkUser.save();

    // Set cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
        profilePicture: checkUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again",
    });
  }
};

// ============= REFRESH TOKEN =============
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found. Please login again",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET_KEY"
    );

    // Check if user exists and token is in database
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please login again",
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.ACCESS_TOKEN_SECRET || "ACCESS_SECRET_KEY",
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again",
    });
  }
};

// ============= FORGOT PASSWORD =============
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: "If email exists, password reset link has been sent",
      });
    }

    // Check if user is Google OAuth user
    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This email is registered with Google. Please login with Google",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Store reset token in database
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.warn("Password reset email not sent:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "If email exists, password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
    });
  }
};

// ============= RESET PASSWORD =============
const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Verify token
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Find user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Check if user is Google OAuth user
    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "Cannot reset password for Google OAuth accounts",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    user.refreshTokens = []; // Invalidate all existing sessions
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// ============= LOGOUT USER =============
const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    if (refreshToken && req.user) {
      // Remove refresh token from database
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
        await user.save();
      }
    }

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// ============= AUTH MIDDLEWARE =============
const authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user. No access token found",
    });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET || "ACCESS_SECRET_KEY"
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired. Please refresh your session",
        isTokenExpired: true,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized user. Invalid token",
    });
  }
};

// ============= ADMIN MIDDLEWARE =============
const adminMiddleware = async (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required",
    });
  }

  next();
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  logoutUser,
  authMiddleware,
  adminMiddleware,
  googleAuthCallback,
};