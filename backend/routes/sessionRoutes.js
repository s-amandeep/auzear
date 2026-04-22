const express = require("express");
const router = express.Router();

const { saveSession } = require("../controllers/sessionController");
const checkApiKey = require("../middleware/authMiddleware");

router.post("/", checkApiKey, saveSession);

module.exports = router;