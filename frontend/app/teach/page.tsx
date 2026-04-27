"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "./components/TeachingCard";
import QuestionsCard from "./components/QuestionsCard";
import PrerequisiteCard from "./components/PrerequisiteCard";
import ParentTip from "./components/ParentTip";
import FeedbackPanel from "./components/FeedbackPanel";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput } from "../types";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function TeachPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [currentClass, setCurrentClass] = useState("");
  const [topic, setTopic] = useState("");
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
    nextStep,
    teachingMode,
    changeTeachingMode,
    deepDive,
    modeLoading,
  } = useTeaching();

  // const child_id = typeof window !== "undefined" ? localStorage.getItem("child_id") : null;
  const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context

  const loadingMessages = [
    "Thinking of a simple way to explain...",
    "Making this easy for your child...",
    "Preparing something helpful...",
  ];

  const labelMap: Record<string, string> = {
    foundational: "Basic",
    intermediate: "Higher",
    advanced: "Advanced",
  };

  useEffect(() => {
    const prefill = localStorage.getItem("prefill_data");
    console.log("prefill - ", prefill);

    if (prefill) {
      try {
        const { topic, classLevel } = JSON.parse(prefill);

        if (topic) setTopic(topic);

        // 🔥 IMPORTANT: ALWAYS respect revisit class
        if (classLevel) {
          setCurrentClass(classLevel);
        }

        localStorage.removeItem("prefill_data");
        return; // 🔥 STOP HERE (don't fallback)
      } catch {}
    }
  }, []);

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!loading) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleStart = async ({ topic, classLevel }: TeachingInput) => {
    trackEvent("teach_started", { topic });

    setHasStarted(true);
    setHasResult(false);

    const res = await startTeaching({ topic, classLevel });

    if (res) {
      localStorage.setItem("selected_class", classLevel);
      setCurrentClass(classLevel);
      setHasResult(true);
    } else {
      setHasStarted(false);
    }
    setTopic(""); // optional
  };

  const handleFinalSave = async () => {
    if (!engagement) {
      alert("Please select how your child responded");
      return;
    }

    try {
      setSaving(true);

      await submitFeedback({
        topic: currentTopic,
        engagement,
        child_id,
      });

      setShowSuccess(true);
      setSaving(false);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save session");
      setSaving(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">
        {hasResult ? `Teach - ${currentTopic}` : "Teach a Concept"}
      </h1>

      {/* Form */}
      {!hasResult && (
        <>
          <ConceptForm
            topic={topic}
            setTopic={setTopic}
            classLevel={currentClass}
            setClassLevel={setCurrentClass}
            onSubmit={handleStart}
            loading={loading}
          />
          <p className="text-xs text-gray-500 text-center mt-1">
            We’ll guide you step by step — no prep needed
          </p>
        </>
      )}

      {/* Loading */}
      {hasStarted && !hasResult && (
        <p className="text-gray-500 text-center mt-4">{loadingMessage}</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center mt-2">{error}</p>
      )}

      {/* Teaching */}
      {hasResult && result && (
        <TeachingCard topic={currentTopic} teach={result} />
      )}

      {/* Mode Switch */}
      {hasResult && !modeLoading && (
        <div className="flex flex-col items-center mt-4">
          <p className="text-xs text-gray-500 mb-2">
            Teaching level:{" "}
            <span className="font-medium">{labelMap[teachingMode]}</span>
          </p>

          <div className="flex gap-2">
            {["foundational", "intermediate", "advanced"].map((mode) => (
              <button
                key={mode}
                onClick={() => changeTeachingMode(mode as any)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  teachingMode === mode
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {labelMap[mode]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode Loading */}
      {modeLoading && (
        <p className="text-sm text-gray-500 mt-4">
          Updating explanation for {labelMap[teachingMode]} level...
        </p>
      )}

      {/* Deep Dive */}
      {teachingMode === "advanced" && deepDive && (
        <div className="bg-blue-50 p-3 rounded-xl w-full max-w-lg mt-3">
          <p className="text-sm font-medium mb-1">Let’s think deeper:</p>
          <p className="text-sm text-gray-800">{deepDive}</p>
        </div>
      )}

      {/* Extras */}
      {hasResult && <ParentTip tip={parentTip} />}
      {hasResult && <PrerequisiteCard data={prerequisite} />}
      {hasResult && <QuestionsCard questions={questions?.questions} />}

      {/* Feedback */}
      {hasResult && result && (
        <FeedbackPanel
          engagement={engagement}
          setEngagement={setEngagement}
          onDone={handleFinalSave}
        />
      )}

      {/* Success */}
      {showSuccess && (
        <p className="text-green-600 text-sm text-center mt-3">
          Nice! One concept strengthened today 🌱
        </p>
      )}

      {/* Next Step */}
      {hasResult && nextStep && (
        <div className="bg-gray-50 p-3 rounded-xl w-full max-w-lg mt-3">
          <p className="text-sm font-medium">What to explore next:</p>
          <p className="text-sm text-gray-700">
            <b>{nextStep.topic}</b> — {nextStep.reason}
          </p>

          <button
            className="text-sm underline mt-2"
            onClick={() => {
              // localStorage.setItem("prefill_topic", nextStep.topic);
              // localStorage.setItem("prefill_class", currentClass || ""); // 🔥 IMPORTANT
              // router.push("/teach");
              setTopic(nextStep.topic); // 👈 update form immediately
              setCurrentClass(currentClass || ""); // keep same class
              // 🔥 FULL RESET (CRITICAL)
              setHasResult(false);
              setHasStarted(false);
              setEngagement("");
            }}
          >
            Start this →
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center mt-10 mb-4">
        You don’t need to be perfect — just consistent 💛
      </p>
    </main>
  );
}
