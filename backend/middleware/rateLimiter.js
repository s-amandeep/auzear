const rateLimit = require("express-rate-limit");

// 🔥 General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: {
    error: "Too many requests. Please try again later.",
  },
});

// 🔥 Strict limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // AI calls per IP
  message: {
    error: "Too many AI requests. Please slow down.",
  },
});

module.exports = {
  apiLimiter,
  aiLimiter,
};