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
  } = useTeaching();

  const handleStart = async ({ topic, classLevel }: TeachingInput) => {
    try {
      setHasStarted(true);
      setHasResult(false); // 🔥 reset before call

      await startTeaching({ topic, classLevel });

      // ✅ ONLY after success
      setHasResult(true);
    } catch (error) {
      console.error(error);
      setHasStarted(false);
      setHasResult(false);
    }
  };

  const handleFinalSave = async () => {
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

      {/* <TeachingCard data={result} />

      {parentTip && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl max-w-md">
          <p className="text-xs text-gray-500 mb-1">Teaching Tip</p>

          <p className="text-sm text-gray-800">💡 {parentTip}</p>
        </div>
      )}

      {prerequisite && (
        <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl max-w-md">
          <p className="text-xs text-gray-500 mb-1">Possible Gap</p>

          <p className="text-sm font-semibold text-gray-800">
            {prerequisite.concept}
          </p>

          <p className="text-sm text-gray-700 mt-1">{prerequisite.explain}</p>
        </div>
      )}

      {questions && (
        <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold mb-3">Ask your child:</h2>
          {questions?.questions?.map((q: string, i: number) => (
            <p key={i} className="mb-2">
              {i + 1}. {q}
            </p>
          ))}

          <div className="mt-4">
            <p className="text-sm text-gray-500">How did your child respond?</p>

            <div className="flex gap-3 mt-2">
              {engagementOptions.map((item) => (
                <button
                  key={item.value}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg border ${
                    engagement === item.value ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setEngagement(item.value)}
                >
                  <span className="text-xl">{item.label}</span>
                  <span className="text-xs mt-1">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {engagement && (
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded-xl"
              onClick={handleImprove}
            >
              {getButtonText()}
            </button>
          )}

          {engagement && (
            <button
              className="mt-2 border px-4 py-2 rounded-xl"
              onClick={handleFinalSave}
            >
              Done for now
            </button>
          )}
        </div>
      )} */}
    </main>
  );
}
