const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/:childId", async (req, res) => {
  const { childId } = req.params;
  console.log("Revision API hit");

  const today = new Date().toISOString();

  const { data } = await supabase
    .from("learning_states")
    .select("*, concepts(name)")
    .lte("next_revision_at", today);

  res.json(data || []);
});

module.exports = router;