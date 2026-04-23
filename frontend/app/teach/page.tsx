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

  const [revisitData, setRevisitData] = useState<any>(null);
  const isRevisit = mode === "revisit";

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
  const [showSuccess, setShowSuccess] = useState(false);

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
      if (!revisitTopic || !child_id) return;

      setHasStarted(true);
      setHasResult(false);

      const res = await fetchLastTeaching(revisitTopic, child_id);

      if ("error" in res || !res.teaching) {
        setHasStarted(false);
        return;
      }

      // 🔥 IMPORTANT: store full object
      setRevisitData(res.teaching);

      setHasResult(true);
    } catch (error) {
      console.error("Revisit failed:", error);
      setHasStarted(false);
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
        teachResult: isRevisit
          ? revisitData
          : {
              teach: result,
              questions: questions?.questions,
              parentTip,
              prerequisite,
            },
      });

      setShowSuccess(true);
      setSaving(false);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
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

  const teachingContent = isRevisit ? revisitData?.teach : result;

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">
        {isRevisit ? " " : "Teach a Concept"}
      </h1>

      {!isRevisit && <ConceptForm onSubmit={handleStart} loading={loading} />}

      {!hasResult && !isRevisit && (
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

      {isRevisit && revisitTopic && (
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold capitalize">{revisitTopic}</h1>
          <p className="text-sm text-gray-500">Revisiting this concept</p>
        </div>
      )}

      {isRevisit && <div className="h-px w-full bg-gray-200 my-2" />}

      {hasResult && teachingContent && (
        <TeachingCard
          topic={isRevisit ? revisitTopic : currentTopic}
          teach={isRevisit ? revisitData?.teach : result}
        />
      )}

      {hasResult && (
        <ParentTip tip={isRevisit ? revisitData?.parentTip : parentTip} />
      )}

      {hasResult && (
        <PrerequisiteCard
          data={isRevisit ? revisitData?.prerequisite : prerequisite}
        />
      )}

      {hasResult && (
        <QuestionsCard
          questions={isRevisit ? revisitData?.questions : questions?.questions}
        />
      )}

      {hasResult && result && (
        <FeedbackPanel
          engagement={engagement}
          setEngagement={setEngagement}
          onImprove={handleImprove}
          onDone={handleFinalSave}
        />
      )}

      {showSuccess && (
        <p className="text-green-600 text-sm text-center mt-3">
          Nice! One concept strengthened today 🌱
        </p>
      )}

      <p className="text-xs text-gray-400 text-center mt-10 mb-4">
        You don’t need to be perfect — just consistent 💛
      </p>
    </main>
  );
}
