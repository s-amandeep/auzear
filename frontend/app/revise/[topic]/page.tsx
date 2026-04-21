"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchQuestions,
  saveSession,
  submitRevisionFeedback,
} from "../../../lib/api";
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
      const res = await fetchQuestions(
        concept,
        "3",
        "c3658790-741b-4823-be25-0822ba4e72df",
      );
      setQuestions(res?.data || []);
      setRevisionLevel(res?.revision_level || 1);
      setTrend(res?.trend || "stable");
    } catch (err) {
      console.error("Failed to load questions");
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

    try {
      await submitRevisionFeedback({
        topic: concept,
        engagement: engagement,
        child_id: "c3658790-741b-4823-be25-0822ba4e72df", // TODO: get actual child ID
      });

      // ✅ Only after successful save

      const msg = messages[Math.floor(Math.random() * messages.length)];
      setRewardMessage(msg);
      setShowReward(true);

      // redirect after delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      // router.push("/dashboard");
    } catch (error) {
      console.error("Error saving session:", error);
      throw error; // propagate to UI
    }
  };

  return (
    <main className="p-6 flex flex-col items-center gap-6">
      {/* {trend && (
        <div className="mt-6 text-center">
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
      )} */}

      <h1 className="text-2xl font-bold">Revise: {concept}</h1>

      {/* <p className="text-xs text-gray-500 text-center">
        A quick check to see how well this is sticking
      </p> */}
      
      {trend && (
        <div className="mt-6 text-center">
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

      <p className="text-sm text-gray-500 mb-2">
        Level {revision_level} Practice
      </p>

      <div className="w-full max-w-xl mx-auto mt-4 flex flex-col gap-4 text-left">
        {questions?.questions?.map((q: string, i: number) => (
          <div key={i} className="p-4 bg-white rounded-2xl shadow text-left">
            <p className="text-gray-800 font-medium">
              {i + 1}. {q}
            </p>
          </div>
        ))}
      </div>

      {questions && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            How did your child perform?
          </p>

          <div className="flex gap-3">
            {options.map((item) => (
              <button
                key={item.value}
                className={`flex flex-col items-center px-3 py-2 rounded-lg border ${
                  engagement === item.value ? "bg-black text-white" : ""
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

      {engagement && (
        <>
          <button
            className="mt-2 border px-4 py-2 rounded-xl"
            onClick={() => handleRevisionFeedback()}
          >
            Save Progress
          </button>
        </>
      )}

      {showReward && (
        <p className="text-center text-green-600 mt-4">{rewardMessage}</p>
      )}

      {showReward && (
        <p className="text-center text-gray-500 mt-2">
          Next: We’ll revisit this tomorrow to make it stick 🧠
        </p>
      )}
    </main>
  );
}
