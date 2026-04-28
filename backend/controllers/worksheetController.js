const { generateWorksheet } = require("../services/worksheetService");

async function handleGenerateWorksheet(req, res) {
  try {
    const {
      topic,
      classLevel,
      teaching_mode,
      understanding_score,
      count = 5,
      style = "mixed",
    } = req.body;

    console.log("Worksheet AI CALL:", {
      endpoint: "worksheet",
      topic,
      classLevel,
      teaching_mode,
      understanding_score,
      style,
      count,
      time: new Date(),
    });

    const worksheet = await generateWorksheet({
      topic,
      classLevel,
      teaching_mode,
      understanding_score,
      count,
      style,
    });

    res.json(worksheet);
  } catch (error) {
    console.error("Worksheet Error:", error);

    res.status(500).json({
      error: true,
      message: "Failed to generate worksheet",
    });
  }
}

module.exports = { handleGenerateWorksheet };
