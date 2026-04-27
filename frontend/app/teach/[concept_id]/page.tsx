"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchTopicDetailV2 } from "@/lib/api";
import TeachingCard from "../components/TeachingCard";
import QuestionsCard from "../components/QuestionsCard";
import ParentTip from "../components/ParentTip";
import PrerequisiteCard from "../components/PrerequisiteCard";
import FeedbackPanel from "../components/FeedbackPanel";
import { useTeaching } from "../../../hooks/useTeaching";

export default function TeachRevisit() {
  const router = useRouter();
  const params = useParams();

  const child_id = "c3658790-741b-4823-be25-0822ba4e72df";

  const concept_id =
    typeof params.concept_id === "string"
      ? params.concept_id
      : Array.isArray(params.concept_id)
        ? params.concept_id[0]
        : undefined;

  const {
    result,
    questions,
    parentTip,
    prerequisite,
    teachingMode,
    changeTeachingMode,
    deepDive,
    modeLoading,
    hydrateTeaching,
    submitFeedback,
  } = useTeaching();

  const [engagement, setEngagement] = useState<
    "low" | "medium" | "high" | "very_high" | ""
  >("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔥 LOAD DATA
  useEffect(() => {
    const load = async () => {
      if (!concept_id) {
        setError("Invalid topic");
        setLoading(false);
        return;
      }

      const res = await fetchTopicDetailV2({
        child_id,
        concept_id,
      });

      if (res?.error) {
        setError("Failed to load topic");
        setLoading(false);
        return;
      }

      setData(res);

      // 🔥 IMPORTANT: hydrate AFTER data
      hydrateTeaching(res, res.class_level ?? res.classLevel ?? 5);

      setLoading(false);
    };

    if (concept_id) load();
  }, [concept_id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading topic...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-red-500">Could not load topic</div>
    );
  }

  // 🔥 SAVE HANDLER (FIXED)
  const handleSave = async () => {
    if (!engagement) {
      alert("Please select how your child responded");
      return;
    }

    try {
      await submitFeedback({
        topic: data.conceptName,
        child_id,
        engagement,
        concept_id, // 🔥 THIS FIXES YOUR DB ISSUE
      });

      setShowSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to save session");
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Teach - {data.conceptName}</h1>

      {/* Teaching */}
      <TeachingCard topic={data.conceptName} teach={result || data.teach} />

      {/* 🔥 MODE SWITCH (NEW) */}
      {!modeLoading && (
        <div className="flex flex-col items-center mt-4">
          <p className="text-xs text-gray-500 mb-2">
            Teaching level: <b>{teachingMode}</b>
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
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {modeLoading && (
        <p className="text-sm text-gray-500">Updating explanation...</p>
      )}

      {/* Deep Dive */}
      {teachingMode === "advanced" && (deepDive || data.deep_dive) && (
        <div className="bg-blue-50 p-3 rounded-xl w-full max-w-lg mt-3">
          <p className="text-sm font-medium mb-1">Let’s think deeper:</p>
          <p className="text-sm text-gray-800">{deepDive || data.deep_dive}</p>
        </div>
      )}

      {/* Parent Tip */}
      <ParentTip tip={parentTip || data.parent_tip} />

      {/* Prerequisite */}
      <PrerequisiteCard data={prerequisite || data.prerequisite} />

      {/* Questions */}
      <QuestionsCard questions={questions?.questions || data.practice} />

      {/* Feedback */}
      <FeedbackPanel
        engagement={engagement}
        setEngagement={setEngagement}
        onDone={handleSave}
      />

      {showSuccess && (
        <p className="text-green-600 text-sm text-center mt-3">
          Great! Understanding updated 🌱
        </p>
      )}

      {/* 🔥 NEXT STEP (IMPROVED) */}
      {data.next_step && (
        <div className="bg-gray-50 p-3 rounded-xl w-full max-w-lg mt-3">
          <p className="text-sm font-medium">What to explore next:</p>
          <p className="text-sm text-gray-700">
            <b>{data.next_step.topic}</b> — {data.next_step.reason}
          </p>

          <button
            className="text-sm underline mt-2"
            onClick={() => {
              localStorage.setItem(
                "prefill_data",
                JSON.stringify({
                  topic: data.next_step.topic,
                  classLevel: String(data.class_level ?? data.classLevel ?? ""),
                }),
              );
              console.log("Revisit class:", data.class_level);

              router.push("/teach");
            }}
          >
            Start this →
          </button>
        </div>
      )}
    </main>
  );
}
