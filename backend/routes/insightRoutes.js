const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { getInsightPrompt } = require("../prompts/insightPrompt");
const { generateFromPrompt } = require("../services/aiService");
const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");

router.get("/:childId", checkApiKey, aiLimiter, async (req, res) => {
  

  const { childId } = req.params;

  console.log("AI CALL:", {
    endpoint: "insights",
    childId: childId,
    time: new Date(),
  });

  try {
    // 🔥 fetch data
    const { data: states } = await supabase
      .from("learning_states")
      .select(
        `
        *,
        concepts (name, subject)
      `,
      )
      .eq("child_id", childId);

    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("child_id", childId);

    // console.log("STATES:", states);
    // console.log("SESSIONS:", sessions);
    // 🔥 send to AI
    const prompt = getInsightPrompt(states, sessions);

    const result = await generateFromPrompt(prompt);
    // console.log("AI RESULT:", result);
    // const parsed = JSON.parse(result);

    let parsed;

    try {
      parsed = JSON.parse(result);
    } catch (e) {
      console.error("JSON PARSE FAILED:", result);

      return res.status(500).json({
        error: "Invalid AI response format",
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("INSIGHT ERROR:", err); // 🔥 ADD THIS

    res.status(500).json({
      error: err.message || "Something failed",
    });
  }
});

module.exports = router;
