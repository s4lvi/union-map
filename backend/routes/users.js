// backend/routes/users.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Existing Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// New Registration Route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields." });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create new user
    user = new User({
      username,
      password, // Password will be hashed via pre-save middleware
      role: "user", // Default role; adjust as needed
    });

    await user.save();

    // Optionally, auto-login the user after registration
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, message: "User registered successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
