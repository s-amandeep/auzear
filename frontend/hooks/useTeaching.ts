import { useState } from "react";
import { fetchTeaching, fetchQuestions, saveSession } from "../lib/api";
import { TeachingInput, QuestionResponse, FeedbackInput } from "../app/types";

export function useTeaching() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [questions, setQuestions] = useState<QuestionResponse | null>(null);

  const startTeaching = async ({topic, classLevel} : TeachingInput) => {
    setLoading(true);

    const teaching = await fetchTeaching(topic, classLevel);
    const q = await fetchQuestions(topic, classLevel);

    setResult(teaching.data);
    setQuestions(q.data);

    setLoading(false);
  };

  const submitFeedback = async ({topic, classLevel, score} : FeedbackInput) => {
    try {
      const result = await saveSession(topic, classLevel, score);
      return result; // ✅ important
    } catch (error) {
      console.error("Error saving session:", error);
      throw error; // propagate to UI
    }
  };

  return {
    loading,
    result,
    questions,
    startTeaching,
    submitFeedback,
  };
}
