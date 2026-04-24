function getTeachingPromptV2(topic, classLevel, teaching_mode, conceptMap) {
  return `
You are an expert teacher.

Teach a Class ${classLevel} student.

Topic: "${topic}"

Teaching Mode: ${teaching_mode}

Concept Map:
${JSON.stringify(conceptMap)}

---

STRICT INSTRUCTIONS:

Your explanation MUST change significantly based on teaching mode.

DO NOT reword the same explanation.

---

MODE DEFINITIONS:

FOUNDATIONAL:
- Very simple explanation
- Focus on intuition
- Use concrete examples
- Avoid abstraction

INTERMEDIATE:
- Structured explanation
- Explain how it works
- Connect sub-concepts
- Introduce light reasoning

ADVANCED:
- Do NOT simplify the concept
- Focus on WHY the concept works
- Introduce deeper reasoning or logic
- Show how this concept connects to other ideas
- Include one comparison or variation
- Add a small conceptual challenge that requires thinking (not recall)

IMPORTANT:
- The explanation must feel significantly more insightful than foundational/intermediate
- Do NOT repeat the same explanation in different words

---

TASKS:

1. Teach the CORE IDEA clearly
2. Explain at least 2 SUB-CONCEPTS
3. Include 1 REAL-LIFE APPLICATION
4. Address 1 COMMON MISTAKE
5. Deep Dive (ONLY for advanced mode):

- If teaching_mode = "advanced":
    - Add a "deep_dive" field
    - Explain WHY the concept works
    - Include a comparison or variation
    - Add a conceptual insight

- If teaching_mode is NOT "advanced":
    - Set "deep_dive": null
    - Do NOT include any deeper explanation
6. Generate 3 practice questions:
   - Q1: basic understanding
   - Q2: application
   - Q3:
       - foundational → simple
       - intermediate → moderate reasoning
       - advanced → conceptual / tricky
    Note that for advanced mode:

       - At least one question must require explanation, not just answer
       - Avoid direct formula-based questions
       - Encourage reasoning or comparison
7. Suggest NEXT STEP:
   - Recommend 1 next topic from "next_topics"
   - Explain why it should be taught next
8. If the topic depends on a prerequisite concept AND the student may struggle:

   - Suggest ONE prerequisite concept
   - Keep it very simple
   - Explain it briefly in 1–2 lines
   - Only include if truly helpful

  Add it in a field called "prerequisite"

---

Return ONLY JSON:

{
  "topic": "...",
  "teach": "...",
  "deep_dive": "...",
  "practice": ["...", "...", "..."],
  "parent_tip": "...",
  "next_step": {
    "topic": "...",
    "reason": "..."
  },
  "prerequisite": {
    "concept": "...",
    "explain": "..."
  }
}
`;
}

module.exports = { getTeachingPromptV2 };