import { FeedbackInput } from "../app/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function fetchTeaching(topic, classLevel, child_id, engagement) {
//   const res = await fetch(`${API_URL}/api/teaching`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ topic, classLevel, child_id, engagement }),
//   });

//   return res.json();
// }
export async function fetchTeaching(topic,
    classLevel,
    engagement) {
  const res = await fetch(`${API_URL}/api/teaching`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: topic,
      classLevel: classLevel,
      child_id: "c3658790-741b-4823-be25-0822ba4e72df",
      engagement: engagement || undefined, // ✅ optional
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to fetch teaching");
  }

  return result;
}

export async function fetchQuestions(topic, classLevel) {
  const res = await fetch(`${API_URL}/api/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, classLevel }),
  });

  return res.json();
}

export async function saveSession(
  topic,
  subject,
  classLevel,
  // score,
  engagement,
) {
  const res = await fetch(`${API_URL}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, subject, classLevel, engagement }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to save session");
  }

  alert("Session saved & revision scheduled!");
  return data;
}
