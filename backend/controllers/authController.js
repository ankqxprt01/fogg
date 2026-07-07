const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const resend = require("../utils/mailer")
// const nodemailer = require("nodemailer");


// Temporary login attempt tracker (in-memory)
const loginAttempts = {};

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Login
// Temporary login attempt tracker
// controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // ❌ User not found → normal error, do not count for bogus mode
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // ✅ Correct password → reset attempts
      delete loginAttempts[email];

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        success: true,
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    }

    // ❌ Wrong password → increment attempts only for that email
    loginAttempts[email] = (loginAttempts[email] || 0) + 1;

    const attemptsLeft = 3 - loginAttempts[email];

    if (loginAttempts[email] >= 3) {
      delete loginAttempts[email]; // reset after redirect
      return res.json({ success: false, redirectBogus: true });
    }

    return res.json({
      success: false,
      attemptsLeft,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// test sendgrid twilo
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: 'antic354@gmail.com',                // recipient
//   from: 'antic354@gmail.com',            // **must match verified sender**
//   subject: 'SendGrid Test Email',
//   text: 'Hello! This is a test email using SendGrid API',
//   html: '<strong>Hello! This is a test email using SendGrid API</strong>',
// };

// sgMail
//   .send(msg)
//   .then(() => console.log('Email sent successfully!'))
//   .catch((err) => console.error('SendGrid error:', err.response?.body || err));


// forgot pass
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    // user.resetPasswordToken = otp; we can see otp and pass in nw tab
    const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    user.resetPasswordToken = hashedOtp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // SEND EMAIL (NO DOMAIN NEEDED)
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:Arial;padding:10px">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log("Resend result:", result);

    return res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// resetpass
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


