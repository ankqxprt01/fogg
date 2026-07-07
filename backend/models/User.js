const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // OLD email token method (you can keep or remove later)
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // NEW OTP method
    resetOTP: String,
    resetOTPExpires: Date,

    files: [
      {
        filename: String,
        originalname: String,
        mimetype: String,
        path: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);