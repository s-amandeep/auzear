const express = require("express");
const router = express.Router();
const checkApiKey = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");

const {
  handleGenerateWorksheet,
} = require("../controllers/worksheetController");

router.post("/", checkApiKey, aiLimiter, handleGenerateWorksheet);

module.exports = router;
