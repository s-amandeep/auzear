"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchQuestions, submitRevisionFeedback } from "../../../lib/api";
import { trackEvent } from "@/lib/analytics";
import { useRouter } from "next/navigation";

export default function RevisePage() {
  const params = useParams();
  const router = useRouter();

  const [engagement, setEngagement] = useState<
    "low" | "medium" | "high" | "very_high" | ""
  >("");
  //   const concept = params?.topic as string;
  const concept = decodeURIComponent(params?.topic as string);

  const [questions, setQuestions] = useState<any>(null);
  const [revision_level, setRevisionLevel] = useState<number>(1);
  const [trend, setTrend] = useState("stable");
  const [rewardMessage, setRewardMessage] = useState("");
  const [showReward, setShowReward] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const messages = [
    "Nice! That concept is getting stronger 🌟",
    "Great job today — small steps matter 💛",
    "You're helping your child build real understanding 👏",
  ];

  useEffect(() => {
    if (!concept) return;
    loadQuestions();
  }, [concept]);

  const loadQuestions = async () => {
    trackEvent("revise_clicked", { topic: concept });

    try {
      // const child_id = localStorage.getItem("child_id");
      const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context

      if (!child_id) return;

      setLoading(true);

      const res = await fetchQuestions({
        topic: concept,
        classLevel: "3",
        child_id,
      });

      if ("error" in res) {
        setError(res.message);
        setLoading(false);
        return;
      }

      setQuestions(res.data || []);
      setRevisionLevel(res.revision_level || 1);
      setTrend(res.trend || "stable");

      setLoading(false);
    } catch (err) {
      console.error("Failed to load questions");
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const options = [
    {
      label: "😕",
      value: "low" as const,
      text: "Struggled",
      background: "px-3 py-2 bg-red-100 rounded-lg",
    },
    {
      label: "🤔",
      value: "medium" as const,
      text: "Partially correct",
      background: "px-3 py-2 bg-yellow-100 rounded-lg",
    },
    {
      label: "😊",
      value: "high" as const,
      text: "Good",
      background: "px-3 py-2 bg-green-100 rounded-lg",
    },
    {
      label: "😄",
      value: "very_high" as const,
      text: "Excellent",
      background: "px-3 py-2 bg-green-200 rounded-lg",
    },
  ];

  if (!concept) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const handleRevisionFeedback = async () => {
    if (!engagement) return;

    trackEvent("revision_feedback_submitted", {
      topic: concept,
      engagement: engagement,
    });

    // const child_id = localStorage.getItem("child_id");
    const child_id = "c3658790-741b-4823-be25-0822ba4e72df"; // temp TODO: get from params or context

    if (!child_id) return;

    try {
      await submitRevisionFeedback({
        topic: concept,
        engagement: engagement,
        child_id: child_id, // TODO: get actual child ID
      });

      // ✅ Only after successful save

      const msg = messages[Math.floor(Math.random() * messages.length)];
      setRewardMessage(msg);
      setShowReward(true);

      // redirect after delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving session:", error);
      throw error; // propagate to UI
    }
  };

  return (
    <main className="p-6 flex flex-col items-center gap-6 max-w-xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center">Revise: {concept}</h1>

      {/* Trend Message */}
      {trend && (
        <div className="text-center">
          {trend === "improving" && (
            <p className="text-green-600">
              Great! Your child is progressing well 🚀
            </p>
          )}
          {trend === "stable" && (
            <p className="text-gray-600">
              Good progress! Let’s strengthen this further 💪
            </p>
          )}
          {trend === "declining" && (
            <p className="text-red-500">
              Let’s revisit basics to build confidence 🌱
            </p>
          )}
        </div>
      )}

      {/* Level */}
      <p className="text-sm text-gray-500">Level {revision_level} Practice</p>

      {/* Loading */}
      {loading && <p className="text-gray-500">Preparing questions...</p>}

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Reward */}
      {showReward && (
        <div className="text-center mt-4">
          <p className="text-green-600">{rewardMessage}</p>
          <p className="text-gray-500 text-sm mt-1">
            We’ll revisit this soon to make it stick 🧠
          </p>
        </div>
      )}

      {/* Questions */}
      {!loading && questions?.questions && (
        <div className="w-full flex flex-col gap-4">
          {questions.questions.map((q: string, i: number) => (
            <div key={i} className="p-4 bg-white rounded-2xl shadow">
              <p className="text-gray-800 font-medium text-left">
                {i + 1}. {q}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {!loading && questions && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">How did your child do?</p>

          <div className="flex gap-2 justify-center flex-wrap">
            {options.map((item) => (
              <button
                key={item.value}
                className={`flex flex-col items-center px-3 py-2 rounded-lg border ${
                  engagement === item.value ? "bg-black text-white" : "bg-white"
                }`}
                onClick={() => setEngagement(item.value)}
              >
                <span>{item.label}</span>
                <span className="text-xs">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      {engagement && (
        <button
          className="mt-4 bg-black text-white px-5 py-2 rounded-xl"
          onClick={handleRevisionFeedback}
        >
          Save Progress
        </button>
      )}
    </main>
  );
}
