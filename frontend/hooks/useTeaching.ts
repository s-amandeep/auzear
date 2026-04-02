import { useState } from "react";
import { fetchTeaching, fetchQuestions, saveSession } from "../lib/api";
import { QuestionResponse } from "../app/types";

export function useTeaching() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [questions, setQuestions] = useState<QuestionResponse | null>(null);

  const startTeaching = async (topic, classLevel) => {
    setLoading(true);

    const teaching = await fetchTeaching(topic, classLevel);
    const q = await fetchQuestions(topic, classLevel);

    setResult(teaching.data);
    setQuestions(q.data);

    setLoading(false);
  };

  const submitFeedback = async (topic, classLevel, score) => {
    await saveSession(topic, classLevel, score);
  };

  return {
    loading,
    result,
    questions,
    startTeaching,
    submitFeedback,
  };
}