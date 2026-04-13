"use client";

import { useState } from "react";
import ConceptForm from "../components/ConceptForm";
import TeachingCard from "../components/TeachingCard";
import { useTeaching } from "../../hooks/useTeaching";
import { TeachingInput, QuestionResponse } from "../types";
import { useRouter } from "next/navigation";

export default function TeachPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [engagement, setEngagement] = useState<
    "low" | "medium" | "high" | "very_high" | ""
  >("");

  const {
    loading,
    result,
    questions,
    startTeaching,
    submitFeedback,
    parentTip,
  } = useTeaching();

  const handleStart = async ({ topic, classLevel }: TeachingInput) => {
    console.log("Starting teaching with:", { topic, classLevel });
    setCurrentTopic(topic);
    setCurrentClass(classLevel);
    startTeaching({ topic, classLevel });
  };

  const engagementOptions = [
    { label: "😕", value: "low" as const, text: "Didn't understand" },
    { label: "🤔", value: "medium" as const, text: "Partially understood" },
    { label: "😊", value: "high" as const, text: "Understood well" },
    { label: "😄", value: "very_high" as const, text: "Enjoyed it" },
  ];

  const getButtonText = () => {
    if (engagement === "low") return "Improve Explanation";
    if (engagement === "medium") return "Explain Better";
    if (engagement === "high") return "Make it Stronger";
    if (engagement === "very_high") return "Challenge Further";
    return "";
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
    await startTeaching({
      topic: currentTopic,
      classLevel: currentClass,
      ...(engagement && { engagement }), // 🔥 only difference
    });
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Teach a Concept</h1>

      <ConceptForm onSubmit={handleStart} />

      {loading && <p>Generating...</p>}

      <TeachingCard data={result} />
      {/* <div className="bg-white p-5 rounded-xl shadow max-w-md">
        <h2 className="font-semibold mb-2">How to Teach</h2>       
        <p className="text-gray-700">{result}</p>
      </div> */}

      {parentTip && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl max-w-md">
          <p className="text-xs text-gray-500 mb-1">Teaching Tip</p>

          <p className="text-sm text-gray-800">💡 {parentTip}</p>
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

          {/* <div className="flex gap-4 mt-4">
            <button onClick={() => handleFeedbackClick(90)}>✅ Got it</button>

            <button onClick={() => handleFeedbackClick(60)}>
              ⚠️ Needs practice
            </button>

            <button onClick={() => handleFeedbackClick(30)}>
              ❌ Didn’t understand
            </button>
          </div> */}

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
      )}
    </main>
  );
}
