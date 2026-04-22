const express = require("express");
const router = express.Router();
const { generateQuestions } = require("../controllers/questionController");
const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");
const { validateTopic } = require("../middleware/validateInput");

router.post("/", checkApiKey, aiLimiter, validateTopic, generateQuestions);

module.exports = router;