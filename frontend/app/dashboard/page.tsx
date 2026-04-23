"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, AlertCircle } from "lucide-react";
import RetentionCard from "./components/RetentionCard";
import TodayRevisionCard from "./components/TodayRevisionCard";
import InsightCard from "./components/InsightCard";
import { useRevision } from "../../hooks/useRevision";
import { trackEvent } from "@/lib/analytics";

export default function Dashboard() {
  const { loading, startRevision, revisionList, retentionScore, suggestion } =
    useRevision();

  const router = useRouter();

  useEffect(() => {
    trackEvent("dashboard_clicked", {});
    startRevision();
  }, []);

  return (
  <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6 gap-6">

    {/* Header */}
    <div className="text-center">
      <h1 className="text-2xl font-semibold">
        Your Child's Learning
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Small steps today build strong understanding
      </p>
    </div>

    {/* Loading */}
    {loading && (
      <p className="text-gray-500 text-sm mt-6">
        Preparing your learning plan...
      </p>
    )}

    {/* Main */}
    {!loading && (
      <div className="w-full max-w-xl flex flex-col gap-4">

        {/* CASE 1: Revisions exist → SHOW BLACK CARD */}
        {revisionList.length > 0 ? (
          <>
            <TodayRevisionCard items={revisionList} />

            {/* Primary CTA */}
            <button
              className="bg-black text-white px-4 py-2 rounded-xl"
              onClick={() => router.push("/teach")}
            >
              Teach Something New
            </button>
          </>
        ) : (
          /* CASE 2: No revision */
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-800 font-medium">
              No revisions due today
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Start with one topic — it only takes a minute 🌱
            </p>

            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded-xl"
              onClick={() => router.push("/teach")}
            >
              Start Teaching
            </button>
          </div>
        )}

        {/* Secondary Navigation (SUBTLE + CLEAN) */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mt-2">

          <button
            onClick={() => router.push("/plan")}
            className="underline"
          >
            Upcoming revisions →
          </button>

          <button
            onClick={() => router.push("/insights")}
            className="underline"
          >
            View detailed insights →
          </button>

        </div>

      </div>
    )}
  </main>
);
}
