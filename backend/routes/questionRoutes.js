const express = require("express");
const router = express.Router();
const { generateQuestions } = require("../services/aiService");

router.post("/", async (req, res) => {
  const { topic, classLevel } = req.body;

  try {
    const result = await generateQuestions(topic, classLevel);
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;