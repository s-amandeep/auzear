"use client";

import { trackEvent } from "@/lib/analytics";
import { useInsights } from "../../hooks/useInsights";
import { useEffect, useState } from "react";

export default function Insights() {
  const { data, loading, fetchData } = useInsights();

  useEffect(() => {
    trackEvent("insights_clicked", {});
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 gap-6">
      {/* Header */}
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Understanding Your Child</h1>
        <p className="text-sm text-gray-500">
          Based on recent learning sessions
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Analyzing learning patterns...</p>
      )}

      {/* Content */}
      {data && (
        <div className="flex flex-col gap-4 w-full max-w-xl">
          {/* Summary */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500 mb-1">Overview</p>
            <p className="text-gray-800">{data.summary}</p>
          </div>

          {/* Pattern */}
          <div className="bg-red-50 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">Learning Pattern</p>
            <p className="text-gray-800">
              Child finds <b>{data.pattern?.weakest_subject}</b> more
              challenging, especially when dealing with{" "}
              <b>{data.pattern?.struggling_with}</b>.
            </p>
          </div>

          {/* Guidance */}
          <div className="bg-blue-50 p-5 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">What You Can Do</p>
            <p className="text-gray-800">💡 {data.guidance}</p>
          </div>
        </div>
      )}
    </div>
  );
}
