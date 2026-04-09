"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [revisionList, setRevisionList] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [retentionScore, setRetentionScore] = useState<number>(0);

  const router = useRouter();

  const getColor = (status: string) => {
    if (status === "strong") return "bg-green-100";
    if (status === "medium") return "bg-yellow-100";
    return "bg-red-100";
  };

  const getStyles = (status: string) => {
    if (status === "strong") {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Strong",
      };
    }
    if (status === "medium") {
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Needs Practice",
      };
    }
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Weak",
    };
  };

  useEffect(() => {
    fetchRevision();
  }, []);

  const handleRevise = (item: any) => {
    router.push(`/revise?concept=${item.conceptName}`);
  };

  const fetchRevision = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/revision/c3658790-741b-4823-be25-0822ba4e72df`,
        // `${process.env.NEXT_PUBLIC_API_URL}/api/revision/${childId}`
      );

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setRevisionList(data.dueToday || []);
        setUpcoming(data.upcoming || []);
        setRetentionScore(data.retentionScore || 0);
      } catch {
        console.error("Not JSON:", text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-semibold">Your Child's Learning</h1>
      <p className="text-gray-500">Track progress and guide improvement</p>

      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <p className="text-gray-500">Retention Score</p>

        <p className="text-4xl font-bold mt-2">{retentionScore}%</p>

        <p className="text-sm text-gray-500 mt-2">
          {retentionScore > 80
            ? "Excellent retention"
            : retentionScore > 60
              ? "Good progress"
              : retentionScore > 40
                ? "Needs attention"
                : "At risk of forgetting"}
        </p>
      </div>

      <div className="w-full max-w-md bg-black text-white rounded-2xl p-6">
        <p className="text-lg font-semibold">
          {revisionList.length > 0
            ? `Today ${revisionList.length} concept(s) need attention`
            : "Great job! You're all caught up. No pending revisions today 🎉"}
        </p>

        <div className="flex flex-col gap-3 mt-4">
          {/* {revisionList.length > 0 ? (
            <button
              className="bg-white text-black px-4 py-2 rounded-xl"
              onClick={() => handleRevise(revisionList[0])}
            >
              Revise Now
            </button>
          ) : (
            <button
              className="bg-white text-black px-4 py-2 rounded-xl"
              onClick={() => router.push("/teach")}
            >
              Teach Something New
            </button>
          )} */}

          {/* <button
            className="border border-white px-4 py-2 rounded-xl"
            onClick={() => router.push("/teach")}
          >
            Teach Something New
          </button> */}
          {!revisionList || revisionList.length === 0 ? (
            <button
              className="bg-white text-black px-4 py-2 rounded-xl"
              onClick={() => router.push("/teach")}
            >
              Teach Something New
            </button>
          ) : (
            revisionList.map((item: any, index) => {
              const style = getStyles(item.status);

              return (
                <div
                  key={index}
                  className={`w-full max-w-md p-5 rounded-2xl shadow-sm ${style.bg}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg text-black">
                      {item.conceptName}
                    </p>

                    {item.memory_strength < 0.4 && (
                      <span className="text-xs text-red-500">
                        Needs Immediate Attention
                      </span>
                    )}

                    <span className={`text-sm ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{
                          width: `${(item.memory_strength || 0) * 100}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Memory Strength:{" "}
                      {Math.round((item.memory_strength || 0) * 100)}%
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Score: {item.understanding_score}
                    </p>

                    <button
                      className="bg-black text-white px-3 py-1 rounded-lg text-sm"
                      onClick={() => handleRevise(item)}
                    >
                      Revise
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold">Upcoming</h2>

      {!upcoming || upcoming.length === 0 ? (
        <p className="text-gray-500">Great job! No upcoming revisions 🎉</p>
      ) : (
        upcoming.map((item: any, index) => {
          const style = getStyles(item.status);

          return (
            <div
              key={index}
              className={`w-full max-w-md p-5 rounded-2xl shadow-sm ${style.bg}`}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{item.conceptName}</p>
                {item.memory_strength < 0.4 && (
                  <span className="text-xs text-red-500">
                    Needs Immediate Attention
                  </span>
                )}

                <span className={`text-sm ${style.text}`}>{style.label}</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${(item.memory_strength || 0) * 100}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Memory Strength:{" "}
                  {Math.round((item.memory_strength || 0) * 100)}%
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Score: {item.understanding_score}
                </p>

                <p className="text-sm text-black-500 mt-1">
                  Next Revision:{" "}
                  {new Date(item.next_revision_at).toLocaleDateString("en-GB")}
                </p>

                <button
                  className="bg-black text-white px-3 py-1 rounded-lg text-sm"
                  onClick={() => handleRevise(item)}
                >
                  Revise
                </button>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}
