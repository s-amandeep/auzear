const { generateInsightsService } = require("../services/insightService");

async function getInsights(req, res) {
  try {
    const { child_id } = req.params;

    console.log("AI CALL:", {
      endpoint: "insights",
      child_id,
      time: new Date(),
    });

    const result = await generateInsightsService(child_id);

    res.json(result);

  } catch (err) {
    console.error("INSIGHT ERROR:", err);
    res.status(500).json({
      error: err.message || "Something failed",
    });
  }
}

module.exports = { getInsights };