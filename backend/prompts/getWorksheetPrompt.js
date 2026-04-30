function getWorksheetPrompt({
  topic,
  classLevel,
  teaching_mode,
  understanding_score,
  count,
  style,
  teach,
}) {
  return `
You are an expert teacher.

A child has just been taught the following:

---
${teach}
---

Topic: ${topic}
Class: ${classLevel}
Teaching level: ${teaching_mode}
Understanding score: ${understanding_score}

Your task is to create a worksheet that CONTINUES THIS EXACT TEACHING.

---

STRICT RULES:

1. Questions MUST be based on the explanation above
2. Do NOT generate generic textbook questions
3. Maintain SAME CONTEXT, examples, and framing used in teaching
4. Match class level STRICTLY (Class ${classLevel})
5. If topic is specific (e.g. Translation in Maths), questions MUST reflect that exact concept
6. Avoid rewording same question — ensure conceptual variety
7. Difficulty must align with teaching level
8. Each question MUST clearly reflect the concept: "${topic}"

---

STYLE GUIDELINES:

- basic → direct recall from explanation
- mixed → recall + application + thinking
- thinking → reasoning, multi-step, scenario-based
- creative → real-world, open-ended, explanation-based

---

Number of questions: ${count}
Style: ${style}

---

VALIDATION BEFORE RESPONSE:

- If questions feel generic → regenerate internally
- If questions don't match explanation → regenerate internally
- If class level mismatch → regenerate internally

---

Return ONLY JSON:

{
  "questions": ["..."],
  "answers": ["..."]
}
`;
}

module.exports = { getWorksheetPrompt };
