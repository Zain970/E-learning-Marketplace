const express = require("express");
const router = express.Router();

const { requireSignin } = require("../middlewares/index");


const { register,
    login,
    logout,
    currentUser,
    sendTestEmail,
    forgotPassword,
    resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);

// router.get("/send-email", sendTestEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;