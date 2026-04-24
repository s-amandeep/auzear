"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchTopicDetailV2 } from "@/lib/api";
import TeachingCard from "../components/TeachingCard";
import QuestionsCard from "../components/QuestionsCard";
import ParentTip from "../components/ParentTip";
import PrerequisiteCard from "../components/PrerequisiteCard";

export default function TeachRevisit() {
  const router = useRouter();
  const params = useParams();

  const concept_id =
    typeof params.concept_id === "string"
      ? params.concept_id
      : Array.isArray(params.concept_id)
        ? params.concept_id[0]
        : undefined;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      // const child_id = typeof window !== "undefined" ? localStorage.getItem("child_id") : null;
      const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context

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

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Teach - {data.conceptName}</h1>

      {/* Teaching */}
      <TeachingCard topic={data.conceptName} teach={data.teach} />

      {/* Deep Dive */}
      {data.teaching_mode === "advanced" && data.deep_dive && (
        <div className="bg-blue-50 p-3 rounded-xl w-full max-w-lg mt-3">
          <p className="text-sm font-medium mb-1">Let’s think deeper:</p>
          <p className="text-sm text-gray-800">{data.deep_dive}</p>
        </div>
      )}

      {/* Parent Tip */}
      <ParentTip tip={data.parent_tip} />

      {/* Prerequisite */}
      <PrerequisiteCard data={data.prerequisite} />

      {/* Questions */}
      <QuestionsCard questions={data.practice} />

      {/* Next Step (VERY IMPORTANT) */}
      {data.next_step && (
        <div className="bg-gray-50 p-3 rounded-xl w-full max-w-lg mt-3">
          <p className="text-sm font-medium">What to explore next:</p>
          <p className="text-sm text-gray-700">
            <b>{data.next_step.topic}</b> — {data.next_step.reason}
          </p>

          <button
            className="text-sm underline mt-2"
            onClick={() => router.push(`/teach/${data.next_step.concept_id}`)}
          >
            Continue →
          </button>
        </div>
      )}
    </main>
  );
}
