// services/teachingServiceV2.js
const { generateFromPrompt } = require("./aiService");
const { getTeachingPromptV2 } = require("../prompts/teachingPromptV2");
const { getConceptMapPrompt } = require("../prompts/conceptMapPrompt");

async function generateTeaching({ topic, classLevel, teaching_mode }) {
  if (!topic) return null;

  const normalizedTopic = topic.trim().toLowerCase();

  function safeParseJSON(raw) {
    try {
      // 🔥 Remove markdown if present
      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Failed");
      console.error("RAW RESPONSE:", raw);
      throw new Error("Invalid AI response");
    }
  }

  // 🔥 STEP 1: Get concept map
  const conceptRaw = await generateFromPrompt(
    getConceptMapPrompt(normalizedTopic, classLevel),
  );

  // console.log("Concept Map Raw:", conceptRaw);
  const conceptMap = safeParseJSON(conceptRaw);

  // 🔥 STEP 2: Generate teaching
  const teachingRaw = await generateFromPrompt(
    getTeachingPromptV2(normalizedTopic, classLevel, teaching_mode, conceptMap),
  );

  // console.log("Teaching Raw:", teachingRaw);
  // console.log("AI response length:", teachingRaw.length);

  if (!teachingRaw || teachingRaw.length < 50) {
    throw new Error("Empty or incomplete AI response");
  }

  // 3. Safe parse
  const parsed = safeParseJSON(teachingRaw);
  // console.log("Parsed teaching: ", parsed);

  return parsed;
}

module.exports = { generateTeaching };
