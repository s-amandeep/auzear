// routes/teachingRoutesV2.js
const express = require("express");
const router = express.Router();
const { generateTeachingV2 } = require("../controllers/teachingControllerV2");
const checkApiKey = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");

router.post("/", checkApiKey, aiLimiter, generateTeachingV2);

module.exports = router;
