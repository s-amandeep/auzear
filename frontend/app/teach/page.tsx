"use client";

import { useState, useEffect } from "react";
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
import { useSearchParams } from "next/navigation";
import { fetchLastTeaching } from "@/lib/api";

export default function TeachPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [currentClass, setCurrentClass] = useState("");
  const [engagement, setEngagement] = useState<
    "low" | "medium" | "high" | "very_high" | ""
  >("");
  const [hasStarted, setHasStarted] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const searchParams = useSearchParams();

  const revisitTopicParam = searchParams.get("topic");
  const revisitTopic = revisitTopicParam ?? "";
  const mode = searchParams.get("mode");
  // const child_id = localStorage.getItem("child_id");
  const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context

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

  const loadingMessages = [
    "Thinking of a simple way to explain...",
    "Making this easy for your child...",
    "Preparing something helpful...",
  ];
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (!loading) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 2000);

    return () => clearInterval(interval); // 🔥 cleanup
  }, [loading]);

  useEffect(() => {
    if (mode === "revisit" && revisitTopic) {
      loadLastTeaching();
    }
  }, [mode, revisitTopic]);

  const loadLastTeaching = async () => {
    try {
      setHasStarted(true);
      setHasResult(false);

      if (!revisitTopic || !child_id) {
        return;
      }

      const res = await fetchLastTeaching(revisitTopic, child_id);

      if (res?.teaching) {
        // 🔥 directly set hook state
        setHasResult(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const msg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  // setLoadingMessage(msg);

  const handleStart = async ({ topic, classLevel }: TeachingInput) => {
    trackEvent("teach_started", { topic });

    setHasStarted(true);
    setHasResult(false);

    const res = await startTeaching({ topic, classLevel });

    if (res) {
      setCurrentClass(classLevel);
      setHasResult(true);
    } else {
      setHasStarted(false);
    }
  };

  const handleFinalSave = async () => {
    if (!engagement) {
      alert("Please select how your child responded");
      return;
    }

    try {
      setSaving(true);

      await submitFeedback({
        engagement,
        child_id,
        teachResult: result, // 🔥 correct source
      });

      setSaving(false);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      alert("Failed to save session");
    }
  };

  const handleImprove = async () => {
    if (!currentTopic) return;

    trackEvent("teach_improve_clicked", { currentTopic, engagement });

    setHasStarted(true);
    setHasResult(false);

    const res = await startTeaching({
      topic: currentTopic,
      classLevel: currentClass,
      ...(engagement && { engagement }),
    });

    if (res) {
      setHasResult(true);
    } else {
      setHasStarted(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm onSubmit={handleStart} />

      {!hasResult && (
        <p className="text-xs text-gray-500 text-center mt-1">
          We’ll guide you step by step — no prep needed
        </p>
      )}

      {hasStarted && !hasResult && (
        <div className="mt-4 text-center">
          <p className="text-gray-500">{loadingMessage}</p>
        </div>
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

      <p className="text-xs text-gray-400 text-center mt-10 mb-4">
        You don’t need to be perfect — just consistent 💛
      </p>
    </main>
  );
}
