// services/teachingServiceV2.js
const { generateFromPrompt } = require("./aiService");
const { getTeachingPromptV2 } = require("../prompts/teachingPromptV2");
const { getConceptMapPrompt } = require("../prompts/conceptMapPrompt");

function normalizeTeach(teach) {
  if (!teach) return "";

  // ✅ Case 1: already string
  if (typeof teach === "string") {
    return teach;
  }

  // ✅ Case 2: structured object (advanced mode)
  if (typeof teach === "object") {
    return [
      teach.why_it_works ? `Why it works:\n${teach.why_it_works}` : null,

      teach.comparison ? `\nComparison:\n${teach.comparison}` : null,

      teach.conceptual_insight
        ? `\nConceptual Insight:\n${teach.conceptual_insight}`
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

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
  // console.log(parsed);

  if (!parsed.teach) {
    throw new Error("Missing teach content");
  }

  // Preserve raw (future use)
  parsed._raw_deep_dive = parsed.deep_dive;

  // Normalize for UI
  parsed.deep_dive = normalizeTeach(parsed.deep_dive);

  return parsed;
}

module.exports = { generateTeaching };
