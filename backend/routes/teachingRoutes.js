const express = require("express");
const router = express.Router();
const { validateTopic } = require("../middleware/validateInput");

const {
  generateTeaching,
  getLastTeaching,
} = require("../controllers/teachingController");

const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");

// POST → generate teaching
router.post("/", checkApiKey, aiLimiter, validateTopic, generateTeaching);

// GET → fetch last teaching
router.get("/last", checkApiKey, getLastTeaching);

module.exports = router;