const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  editProfile,
  refreshAccessToken,
  logoutUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getMe);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/logout", logoutUser);

module.exports = router;
