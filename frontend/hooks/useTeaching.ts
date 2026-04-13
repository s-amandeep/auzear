import { useState } from "react";
import { fetchTeaching, saveSession } from "../lib/api";
import { TeachingInput, QuestionResponse, FeedbackInput } from "../app/types";

export function useTeaching() {
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [result, setResult] = useState("");
  const [questions, setQuestions] = useState<QuestionResponse | null>(null);
  const [parentTip, setParentTip] = useState(""); 


  const startTeaching = async ({ topic, classLevel, engagement }: TeachingInput) => {
    setLoading(true);

    const teaching = await fetchTeaching(topic, classLevel, engagement);

    setCurrentTopic(teaching.topic);
    setCurrentSubject(teaching.subject);
    setResult(teaching.teach);
    setQuestions({ questions: teaching.questions });
    setParentTip(teaching.parentTip || "");
    setCurrentClass(classLevel);

    setLoading(false);

    return teaching;
  };

  const submitFeedback = async ({ engagement }: FeedbackInput) => {
    try {
      const result = await saveSession({
        topic: currentTopic,
        subject: currentSubject || "General",
        classLevel: currentClass,
        // score,
        engagement,
      });
      return result; // ✅ important
    } catch (error) {
      console.error("Error saving session:", error);
      throw error; // propagate to UI
    }
  };

  // const improveTeaching = async ({ topic, classLevel }: TeachingInput) => {
  //   setLoading(true);

  //   const teaching = await fetchTeaching(topic, classLevel);

  //   setCurrentTopic(teaching.topic);
  //   setCurrentSubject(teaching.subject);
  //   setResult(teaching.teach);
  //   setQuestions({ questions: teaching.questions });
  //   setCurrentClass(classLevel);

  //   setLoading(false);

  //   return teaching;
  // };

  return {
    loading,
    currentTopic,
    currentSubject,
    result,
    questions,
    startTeaching,
    submitFeedback,
    parentTip,
  };
}
