const { getWorksheetPrompt } = require("../prompts/getWorksheetPrompt");
const { generateFromPrompt } = require("./aiService");

async function generateWorksheet(data) {
  const {
    topic,
    classLevel,
    teaching_mode,
    understanding_score,
    count,
    style,
  } = data;

  if (!topic || !classLevel) {
    throw new Error("Missing required fields");
  }

  const prompt = getWorksheetPrompt({
    topic,
    classLevel,
    teaching_mode,
    understanding_score,
    count,
    style,
  });

  const raw = await generateFromPrompt(prompt);

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Worksheet JSON parse failed:", raw);
    throw new Error("Invalid AI response");
  }

  // 🔥 basic validation (production safety)
  if (
    !parsed.questions ||
    !parsed.answers ||
    parsed.questions.length !== count
  ) {
    throw new Error("Invalid worksheet format");
  }

  return parsed;
}

module.exports = { generateWorksheet };
