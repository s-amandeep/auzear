const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { aiLimiter } = require("../middleware/rateLimiter");
const checkApiKey = require("../middleware/authMiddleware");

router.get("/:childId", checkApiKey, aiLimiter, async (req, res) => {
  

  const { childId } = req.params;

  console.log("DB CALL:", {
    endpoint: "profile",
    childId: childId,
    time: new Date(),
  });

  try {
    // 🔥 fetch data
    const { data: child } = await supabase
      .from("children")
      .select("*")
      .eq("child_id", childId);

    // console.log("d---", child);
    return res.json(child);

  } catch (err) {
    console.error("PROFILE ERROR:", err); // 🔥 ADD THIS

    res.status(500).json({
      error: err.message || "Something failed",
    });
  }
});

module.exports = router;