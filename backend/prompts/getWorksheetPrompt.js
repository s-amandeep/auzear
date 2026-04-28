function getWorksheetPrompt({
  topic,
  classLevel,
  teaching_mode,
  understanding_score,
  count,
  style,
}) {
  return `
You are an expert school teacher.

Create a worksheet for a Class ${classLevel} student.

Topic: ${topic}
Teaching level: ${teaching_mode}
Understanding score: ${understanding_score}

Number of questions: ${count}

Worksheet style: ${style}

---

Style meaning:

- basic → simple recall, fill blanks (Basic Practice)
- mixed → mix of easy, moderate, thinking (Mixed Practice)
- thinking → application, reasoning (Thinking & Application)
- creative → real-life, imaginative (Fun & Creative)

---

Instructions:

1. Generate EXACTLY ${count} questions
2. Be very sure to match difficulty with teaching level
3. Adjust questions based on worksheet style
4. Keep language simple and age-appropriate
5. Keep questions short and clear and no long explanations in questions
6. Do NOT repeat questions

---

Also generate answers.

---

Return ONLY JSON:

{
  "questions": ["..."],
  "answers": ["..."]
}
`;
}

module.exports = { getWorksheetPrompt };
