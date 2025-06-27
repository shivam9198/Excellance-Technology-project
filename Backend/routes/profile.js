// routes/userRoutes.js or routes/profileRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const profileRouter = express.Router();

// GET /profile
profileRouter.get("/profile", authMiddleware, async (req, res) => {
  res.json({
    username: req.user.username,
    id: req.user._id,
  });
});

module.exports = profileRouter;
