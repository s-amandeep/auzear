const express = require("express");
const router = express.Router();

const { getInsights } = require("../controllers/insightController");
const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");

router.get("/:child_id", checkApiKey, aiLimiter, getInsights);

module.exports = router;