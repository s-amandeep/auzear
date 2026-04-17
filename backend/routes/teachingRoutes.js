const express = require("express");
const router = express.Router();
const { generateTeaching } = require("../controllers/teachingController");
const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");

router.post("/", checkApiKey, aiLimiter, generateTeaching);
  
module.exports = router;