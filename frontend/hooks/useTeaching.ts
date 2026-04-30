"use client";

import { useRef, useState } from "react";
import { fetchTeachingV2, saveSessionV2 } from "../lib/api";
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
  const [nextStep, setNextStep] = useState<any>(null);
  const [deepDive, setDeepDive] = useState<string | null>(null);
  const [modeLoading, setModeLoading] = useState(false);
  const [teachingMode, setTeachingMode] = useState<
    "foundational" | "intermediate" | "advanced"
  >("foundational");

  // const child_id = typeof window !== "undefined" ? localStorage.getItem("child_id") : null;
  const storedChildId = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: replace with actual child_id

  const requestIdRef = useRef(0);

  const startTeaching = async ({
    topic,
    classLevel,
    engagement,
  }: TeachingInput) => {
    setLoading(true);
    setError("");

    if (!storedChildId) {
      setError("Child not found. Please reload.");
      setLoading(false);
      return null;
    }

    let teaching;

    try {
      teaching = await fetchTeachingV2({
        topic,
        classLevel: Number(classLevel),
        child_id: storedChildId, // 🔥 TEMP fix
        teaching_mode: teachingMode, // 👈 NEW
      });

      if (teaching?.error) {
        setError(teaching.message);
        setLoading(false);
        return null;
      }

      setCurrentTopic(teaching.topic);
      setCurrentSubject(teaching.subject);
      setResult(teaching.teach);
      setQuestions({ questions: teaching.practice || [] });
      setParentTip(teaching.parent_tip || "");
      setNextStep(teaching.next_step || null);
      setCurrentClass(classLevel);
      setDeepDive(teaching.deep_dive || null);
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
    topic,
    engagement,
    child_id,
    concept_id,
  }: FeedbackInput) => {
    try {
      let response;

      let score = 60;

      if (engagement === "low") score = 30;
      else if (engagement === "medium") score = 60;
      else if (engagement === "high") score = 80;
      else if (engagement === "very_high") score = 95;
      // console.log("latest score ", score);

      if (!result) {
        alert("No teaching content to save");
        return;
      }

      response = await saveSessionV2({
        ...(concept_id
          ? { concept_id }
          : {
              topic,
              subject: currentSubject || "General",
              classLevel: Number(currentClass),
            }),

        child_id,
        teaching_mode: teachingMode,
        understanding_score: score,

        teach: result,
        practice: questions?.questions || [],
        parent_tip: parentTip,
        prerequisite,
        deep_dive: deepDive,
        next_step: nextStep,
      });

      return response;
    } catch (error) {
      console.error("Error saving session:", error);
      throw error;
    }
  };

  const changeTeachingMode = async (
    newMode: "foundational" | "intermediate" | "advanced",
  ) => {
    setTeachingMode(newMode);
    setModeLoading(true);

    const requestId = ++requestIdRef.current;

    // re-call teaching with same topic
    if (!currentTopic) return;

    const teaching = await fetchTeachingV2({
      topic: currentTopic,
      classLevel: Number(currentClass),
      child_id: storedChildId, // 🔥 TEMP fix
      // child_id: localStorage.getItem("child_id") || "",
      teaching_mode: newMode,
    });

    // 🔥 Ignore old responses
    if (requestId !== requestIdRef.current) return;

    if (!teaching?.error) {
      setResult(teaching.teach);
      setQuestions({ questions: teaching.practice || [] });
      setParentTip(teaching.parent_tip || "");
      setNextStep(teaching.next_step || null);
      setDeepDive(teaching.deep_dive || null);
      setPrerequisite(teaching.prerequisite || null);
    }

    setModeLoading(false);
  };

  const hydrateTeaching = (data: any, classLevel: number) => {
    setCurrentTopic(data.conceptName);
    setCurrentSubject(data.subject || "General");
    setResult(data.teach);
    setQuestions({ questions: data.practice || [] });
    setParentTip(data.parent_tip || "");
    setPrerequisite(data.prerequisite || null);
    setNextStep(data.next_step || null);
    setDeepDive(data.deep_dive || null);
    setTeachingMode(data.teaching_mode || "foundational");
    setCurrentClass(String(classLevel || 5));
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
    nextStep,

    // 🔥 NEW
    teachingMode,
    changeTeachingMode,
    deepDive,
    modeLoading,
    hydrateTeaching,
  };
}
