"use client";

import { useState } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "./components/TeachingCard";
import QuestionsCard from "./components/QuestionsCard";
import PrerequisiteCard from "./components/PrerequisiteCard";
import ParentTip from "./components/ParentTip";
import FeedbackPanel from "./components/FeedbackPanel";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput, QuestionResponse } from "../types";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function TeachPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  // const [currentTopic, setCurrentTopic] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [engagement, setEngagement] = useState<
    "low" | "medium" | "high" | "very_high" | ""
  >("");
  const [hasStarted, setHasStarted] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const {
    loading,
    currentTopic,
    result,
    questions,
    startTeaching,
    submitFeedback,
    parentTip,
    prerequisite,
    error,
  } = useTeaching();

  const handleStart = async ({ topic, classLevel }: TeachingInput) => {
    trackEvent("teach_started", { topic });
    try {
      setHasStarted(true);
      setHasResult(false); // 🔥 reset before call

      await startTeaching({ topic, classLevel });
      setCurrentClass(classLevel);

      // ✅ ONLY after success
      setHasResult(true);
    } catch (error) {
      console.error(error);
      setHasStarted(false);
      setHasResult(false);
    }
  };

  const handleFinalSave = async () => {
    trackEvent("done_clicked", { currentTopic });
    try {
      if (!engagement) {
        alert("Please select how your child responded");
        return;
      }

      setSaving(true);

      await submitFeedback({ engagement });
      setSaving(false);

      // ✅ Only after successful save
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to save session");
    }
  };

  const handleImprove = async () => {
    trackEvent("teach_started", { currentTopic, engagement });
    if (!currentTopic) return;

    try {
      setHasStarted(true);
      setHasResult(false); // 🔥 reset before call

      await startTeaching({
        topic: currentTopic,
        classLevel: currentClass,
        ...(engagement && { engagement }), // 🔥 only difference
      });
      // ✅ ONLY after success
      setHasResult(true);
    } catch (error) {
      console.error(error);
      setHasStarted(false);
      setHasResult(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm onSubmit={handleStart} />

      {/* {loading && <p>Generating...</p>} */}
      {hasStarted && !hasResult && (
        <p className="mt-4 text-gray-500">Generating lesson...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center mt-2">{error}</p>
      )}

      {hasResult && result && (
        <TeachingCard topic={currentTopic} teach={result} />
      )}

      {hasResult && parentTip && <ParentTip tip={parentTip} />}

      {hasResult && prerequisite && <PrerequisiteCard data={prerequisite} />}

      {hasResult && result && (
        <QuestionsCard questions={questions?.questions} />
      )}

      {hasResult && result && (
        <FeedbackPanel
          engagement={engagement}
          setEngagement={setEngagement}
          onImprove={handleImprove}
          onDone={handleFinalSave}
        />
      )}
    </main>
  );
}
