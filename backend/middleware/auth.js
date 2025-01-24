// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found, authorization denied" });
    }

    // Attach user and role to request object
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
