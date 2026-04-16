import { FeedbackInput } from "../app/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTeaching(topic, classLevel, engagement) {
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
  console.log("Fetched teaching:", result);

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

  const result = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch questions");
  }

  return result;
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

export async function fetchRevision() {
  const res = await fetch(
    `${API_URL}/api/revision/c3658790-741b-4823-be25-0822ba4e72df`,
    // `${API_URL}/api/revision/${childId}`
  );

  const text = await res.text();
  const data = JSON.parse(text);

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch revision");
  }

  return data;
}

export async function fetchInsights() {
  // export async function fetchInsights(childId) {
  const res = await fetch(
    `${API_URL}/api/insights/c3658790-741b-4823-be25-0822ba4e72df`,
    // `${API_URL}/api/insights/${childId}`
  );

  console.log("Fetched insights:", res);
  if (!res.ok) {
    const text = await res.text();
    console.error("Backend error:", text);

    throw new Error("Insights fetch failed");
  }

  const data = await res.json();

  // const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch insights");
  }

  return data;
}
