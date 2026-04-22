const express = require("express");
const router = express.Router();

const {
  getDashboard,
  saveFeedback,
} = require("../controllers/revisionController");

const checkApiKey = require("../middleware/authMiddleware");

router.get("/:child_id", checkApiKey, getDashboard);
router.post("/feedback", checkApiKey, saveFeedback);

module.exports = router;