"use client";

import { trackEvent } from "@/lib/analytics";
import { useInsights } from "../../hooks/useInsights";
import { useEffect, useState } from "react";

export default function Insights() {
  const { data, loading, error, fetchData } = useInsights();

  useEffect(() => {
    trackEvent("insights_clicked", {});
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center px-4 py-6 gap-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Understanding Your Child</h1>
        <p className="text-sm text-gray-500 mt-1">
          Small insights to guide better learning
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Analyzing learning patterns...</p>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Empty State */}
      {!loading && !data && !error && (
        <p className="text-gray-500 text-sm text-center">
          Start teaching a few topics to see insights here 🌱
        </p>
      )}

      {/* Content */}
      {data && (
        <div className="flex flex-col gap-4 w-full">
          {/* Summary */}
          {data.summary && (
            <div className="bg-white p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-500 mb-1">Overview</p>
              <p className="text-gray-800">{data.summary}</p>
            </div>
          )}

          {/* Pattern */}
          {data.pattern && (
            <div className="bg-yellow-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500 mb-1">Learning Pattern</p>
              <p className="text-gray-800">
                Your child may need a little more support in{" "}
                <b>{data.pattern.weakest_subject}</b>, especially around{" "}
                <b>{data.pattern.struggling_with}</b>.
              </p>
            </div>
          )}

          {/* Guidance */}
          {data.guidance && (
            <div className="bg-blue-50 p-5 rounded-2xl">
              <p className="text-sm text-gray-500 mb-1">What You Can Do</p>
              <p className="text-gray-800">💡 {data.guidance}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        Every child learns differently — you're doing great 💛
      </p>
    </div>
  );
}
