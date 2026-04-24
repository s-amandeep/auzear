function getConceptMapPrompt(topic, classLevel) {
  return `
You are an expert educator.

Analyze the topic for a Class ${classLevel} student.

Topic: "${topic}"

Your job is to break this topic into a structured learning map.

Instructions:

1. Identify the CORE IDEA of the topic
2. List 3–5 SUB-CONCEPTS needed to fully understand it
3. Identify REAL-LIFE APPLICATIONS (2–3)
4. Identify COMMON MISTAKES students make
5. Identify 1–2 PREREQUISITE concepts (if needed)
6. Suggest 2 NEXT TOPICS that should be taught after this

Important:
- Adapt depth based on class level
- For lower classes → keep simple and concrete
- For higher classes → include deeper reasoning and structure

Return ONLY JSON:

{
  "core_idea": "...",
  "sub_concepts": ["...", "..."],
  "applications": ["...", "..."],
  "common_mistakes": ["...", "..."],
  "prerequisites": ["..."],
  "next_topics": ["...", "..."]
}
`;
}

module.exports = { getConceptMapPrompt };