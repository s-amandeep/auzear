// routes/sessionRoutesV2.js
const express = require("express");
const router = express.Router();
const { saveSessionV2 } = require("../controllers/sessionControllerV2");
const checkApiKey = require("../middleware/authMiddleware");

router.post("/", checkApiKey, saveSessionV2);

module.exports = router;