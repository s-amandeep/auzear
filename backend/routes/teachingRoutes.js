const express = require("express");
const router = express.Router();
const { generateTeaching } = require("../controllers/teachingController");
const { aiLimiter } = require("../middleware/rateLimiter");

router.post("/", aiLimiter, generateTeaching);
  
module.exports = router;