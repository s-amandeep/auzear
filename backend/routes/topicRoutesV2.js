// routes/topicRoutesV2.js
const express = require("express");
const router = express.Router();
const { getTopics, getTopicDetail } = require("../controllers/topicControllerV2");
const checkApiKey = require("../middleware/authMiddleware");

router.get("/:child_id", checkApiKey, getTopics);

router.get("/:child_id/:concept_id", checkApiKey, getTopicDetail);

module.exports = router;
