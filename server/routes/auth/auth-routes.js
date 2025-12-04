const express = require("express");

const passport = require("../../config/passport"); // Add this import

const {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  logoutUser,
  authMiddleware,
  googleAuthCallback, // New controller
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// ============= PUBLIC ROUTES =============

router.post("/register", registerUser);

router.post("/verify-email", verifyEmail);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/refresh-token", refreshAccessToken);

// ============= GOOGLE OAUTH ROUTES =============

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`,
  }),
  googleAuthCallback
);

// ============= PROTECTED ROUTES =============

// ✅ UPDATED: Logout is now PUBLIC (no authMiddleware)
router.post("/logout", logoutUser);

// Check authentication status
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user,
  });
});

module.exports = router;