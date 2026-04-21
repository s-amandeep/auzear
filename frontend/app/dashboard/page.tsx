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
  const {
    loading,
    startRevision,
    revisionList,
    retentionScore,
    suggestion,
  } = useRevision();
 
  
  const router = useRouter();

  useEffect(() => {
    trackEvent("dashboard_clicked", {});
    startRevision();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-semibold">Your Child's Learning</h1>
      <p className="text-gray-500">Track progress and guide improvement</p>

      {/* <p className="text-xs text-gray-500 text-center">
        You’ve been teaching for  days in a row 🌱
      </p>   */}      

      <TodayRevisionCard items={revisionList} />

      <InsightCard text={suggestion} />

      <RetentionCard score={retentionScore} />

      <button
        className="mt-4 bg-black text-white px-4 py-2 rounded-xl"
        onClick={() => router.push("/teach")}
      >
        Start Teaching
      </button>

      {/* <h2 className="text-xl font-semibold">Subject Performance</h2>

      {subjectStats.length === 0 ? (
        <p>No subject data yet</p>
      ) : (
        subjectStats.map((s: any, i: number) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow w-full max-w-md"
          >
            <div className="flex justify-between">
              <p>{s.subject}</p>
              <p>{Math.round(s.avgMemory * 100)}%</p>
            </div>

            <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
              <div
                className="bg-black h-2 rounded-full"
                style={{ width: `${s.avgMemory * 100}%` }}
              />
            </div>
          </div>
        ))
      )} */}

      {/* {weakestSubject && (
        <div className="bg-red-50 p-4 rounded-xl w-full max-w-md">
          <p className="font-semibold">Focus Area: {weakestSubject.subject}</p>
          <p className="text-sm text-gray-600">Needs attention</p>
        </div>
      )} */}
    </main>
  );
}
