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
        <h1 className="text-2xl font-semibold">Your Child's Learning</h1>
        <p className="text-gray-500 text-sm mt-1">
          Small steps every day build strong understanding
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-500 text-sm mt-6">
          Preparing today’s plan...
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Today Focus */}
          <TodayRevisionCard items={revisionList} />

          {/* Insight */}
          {suggestion && <InsightCard text={suggestion} />}

          {/* Retention */}
          <RetentionCard score={retentionScore} />

          {/* CTA */}
          <button
            className="mt-4 bg-black text-white px-5 py-2 rounded-xl"
            onClick={() => router.push("/teach")}
          >
            Teach Something New
          </button>
        </>
      )}
    </main>
  );
}
