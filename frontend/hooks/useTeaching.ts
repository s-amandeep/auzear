"use client";

import { useState } from "react";
import { fetchTeaching, saveSession } from "../lib/api";
import { TeachingInput, QuestionResponse, FeedbackInput } from "../app/types";

export function useTeaching() {
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [error, setError] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [result, setResult] = useState("");
  const [questions, setQuestions] = useState<QuestionResponse | null>(null);
  const [parentTip, setParentTip] = useState("");
  const [prerequisite, setPrerequisite] = useState<any>(null);

  const startTeaching = async ({
    topic,
    classLevel,
    engagement,
  }: TeachingInput) => {
    setLoading(true);
    setError("");

    const storedChildId = localStorage.getItem("child_id");
    // const storedChildId = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: replace with actual child_id

    if (!storedChildId) {
      setError("Child not found. Please reload.");
      setLoading(false);
      return null;
    }

    try {
      const teaching = await fetchTeaching({
        topic,
        classLevel,
        child_id: storedChildId, // 🔥 TEMP fix        
        ...(engagement && { engagement }),
      });

      if (teaching?.error) {
        setError(teaching.message);
        setLoading(false);
        return null;
      }

      setCurrentTopic(teaching.topic);
      setCurrentSubject(teaching.subject);
      setResult(teaching.teach);
      setQuestions({ questions: teaching.questions });
      setParentTip(teaching.parentTip || "");
      setCurrentClass(classLevel);
      setPrerequisite(teaching.prerequisite || null);

      setLoading(false);

      return teaching; // 🔥 IMPORTANT
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
      return null;
    }
  };

  const submitFeedback = async ({
    engagement,
    child_id,
    teachResult,
  }: FeedbackInput) => {
    return await saveSession({
      topic: currentTopic,
      subject: currentSubject || "General",
      child_id,
      engagement,
      teachResult,
    });
  };

  return {
    loading,
    currentTopic,
    currentSubject,
    result,
    questions,
    startTeaching,
    submitFeedback,
    parentTip,
    prerequisite,
    error,
  };
}
