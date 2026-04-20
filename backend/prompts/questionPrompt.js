function getQuestionPrompt(topic, classLevel, revision_level) {
  return `
You are teaching a Class ${classLevel} student.

Topic: ${topic}

The child is currently at Revision Level: ${revision_level}

Your goal is to:
- Assess understanding
- Gradually increase thinking level
- Build confidence, not fear

---

Question Guidelines:

Level 1 (Very Basic):
- Recall or identify
- Extremely simple
- Direct concept check

Level 2 (Basic Understanding):
- Slight thinking required
- Use simple real-life situations

Level 3 (Application):
- Apply concept in a situation
- Slight twist

Level 4 (Advanced Thinking):
- Requires reasoning
- Not direct

Level 5 (Real-life Thinking):
- Practical scenario
- Child must think before answering

---

Instructions:

- Generate EXACTLY 3 questions
- Questions must match the child's current level (${revision_level})
- Keep language simple and friendly
- No MCQs
- No long explanations
- No repetition
- Make it feel like a real teacher asking
-- Follow this structure while generating questions:
    - Question 1: easiest
    - Question 2: moderate
    - Question 3: slightly challenging (within level)

---

Return ONLY JSON:

{
  "questions": [
    "...",
    "...",
    "..."
  ]
}
`;
}

module.exports = { getQuestionPrompt };
