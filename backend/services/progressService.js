function getScoreFromEngagement(engagement) {
  if (engagement === "low") return 30;
  if (engagement === "medium") return 60;
  if (engagement === "high") return 80;
  return 95;
}

function calculateProgress({ currentScore, prevScore, prevMemory, prevLevel }) {
  // Trend
  let trend = "stable";
  if (currentScore > prevScore + 10) trend = "improving";
  else if (currentScore < prevScore - 10) trend = "declining";

  // Memory
  const newMemory = 0.7 * prevMemory + 0.3 * (currentScore / 100);

  // Level
  let newLevel = prevLevel;
  if (currentScore >= 80 && trend !== "declining") {
    newLevel = Math.min(prevLevel + 1, 5);
  } else if (currentScore < 40) {
    newLevel = Math.max(prevLevel - 1, 1);
  }

  // Next revision
  let days = 1;
  if (newMemory > 0.7) days = 3;
  if (newMemory > 0.85) days = 5;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);

  return {
    trend,
    newMemory,
    newLevel,
    nextDate,
  };
}

module.exports = {
  getScoreFromEngagement,
  calculateProgress,
};
