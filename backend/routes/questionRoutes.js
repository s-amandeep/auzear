const express = require("express");
const router = express.Router();
const { generateQuestions } = require("../controllers/questionController");
const { aiLimiter } = require("../middleware/rateLimiter");

router.post("/", aiLimiter, generateQuestions);

module.exports = router;