const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer=require("nodemailer");
const OTPStore = new Map();
// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, userid, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    const user = new User({ name, userid, email, password });
    await user.save();

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// === SEND OTP FOR RESET PASSWORD ===
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTPStore.set(email, otp);

    console.log("Sending OTP to:", email);
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS);

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// === RESET PASSWORD USING OTP ===
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const storedOtp = OTPStore.get(email);

    if (storedOtp !== otp) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    await User.findOneAndUpdate({ email }, { password: newPassword });
    OTPStore.delete(email);

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// === UPDATE PROFILE (name, email, profile picture) ===
router.put("/update-profile", async (req, res) => {

  try {
    const { email, name, newEmail, profilePic } = req.body;
    console.log("Update request body:", req.body);

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    // Check for email conflict if email is being changed
    if (email !== newEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) return res.json({ success: false, message: "New email is already in use" });
    }

    // Update user details
    user.name = name;
    user.email = newEmail;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
