import { FeedbackInput } from "../app/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
});

export async function fetchTeaching(topic, classLevel, engagement) {
  console.log("API CALL:", `${API_URL}/api/teaching`);
  try {
    const res = await fetch(`${API_URL}/api/teaching`, {
      method: "POST",
      headers: getHeaders(),
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
  } catch (error) {
    console.error("API Error:", error);

    return {
      error: true,
      message: "Server is waking up... please try again in a few seconds",
    };
  }
}

export async function fetchQuestions(topic, classLevel, childId) {
  try {
    const res = await fetch(`${API_URL}/api/questions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ topic, classLevel, childId }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch questions");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);

    return {
      error: true,
      message: "Server is waking up... please try again in a few seconds",
    };
  }
}

export async function saveSession(
  topic,
  subject,
  classLevel,
  // score,
  engagement,
) {
  try {
    const res = await fetch(`${API_URL}/api/session`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ topic, subject, classLevel, engagement }),
    });

    const data = await res.json();
    // console.log("Saved session:", data);

    if (!res.ok) {
      throw new Error(data.error || "Failed to save session");
    }

    alert("Nice! That’s one concept strengthened today 🌟. Session saved & revision scheduled!");
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: true,
      message: "Server is waking up... please try again in a few seconds",
    };
  }
}

export async function fetchRevision() {
  try {
    const res = await fetch(
      `${API_URL}/api/revision/c3658790-741b-4823-be25-0822ba4e72df`,
      // `${API_URL}/api/revision/${childId}`
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch revision");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: true,
      message: "Server is waking up... please try again in a few seconds",
    };
  }
}

export async function fetchInsights() {
  // export async function fetchInsights(childId) {
  try {
    const res = await fetch(
      `${API_URL}/api/insights/c3658790-741b-4823-be25-0822ba4e72df`,
      // `${API_URL}/api/insights/${childId}`
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    // console.log("Fetched insights:", res);
    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);

      throw new Error("Insights fetch failed");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: true,
      message: "Server is waking up... please try again in a few seconds",
    };
  }
}

export async function submitRevisionFeedback(data) {
  const res = await fetch(`${API_URL}/api/revision/feedback`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}