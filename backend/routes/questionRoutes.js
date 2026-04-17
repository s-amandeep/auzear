const express = require("express");
const router = express.Router();
const { generateQuestions } = require("../controllers/questionController");
const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");

router.post("/", checkApiKey, aiLimiter, generateQuestions);

module.exports = router;