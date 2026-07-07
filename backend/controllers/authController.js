const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Temporary login attempt tracker (in-memory)
const loginAttempts = {};

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

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


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, attemptsLeft: 2 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // ✅ Correct password → reset attempts
    if (isMatch) {
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

    // ❌ Wrong password
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