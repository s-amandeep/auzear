"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [revisionList, setRevisionList] = useState<any[]>([]);
  const [retentionScore, setRetentionScore] = useState<number>(0);

  const router = useRouter();

  const getColor = (status: string) => {
    if (status === "strong") return "bg-green-100";
    if (status === "medium") return "bg-yellow-100";
    return "bg-red-100";
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
      );

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setRevisionList(data.revision || []);
        setRetentionScore(data.retentionScore || 0);
      } catch {
        console.error("Not JSON:", text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Need to add fetchRetentionScore Logic where I set setRetentionScore(data.retentionScore || 0);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Today's Learning</h1>

      <div className="bg-green-100 p-4 rounded-xl">
        <p className="text-lg font-semibold">
          Retention Score: {retentionScore}%
        </p>
      </div>

      <h2 className="text-2xl font-bold">Today's Revision</h2>

      {!revisionList || revisionList.length === 0 ? (
        <p>Great job! No pending revisions 🎉</p>
      ) : (
        revisionList.map((item: any, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.conceptName}</p>
              {/* <div className={`p-4 rounded-xl ${getColor(item.status)}`}></div>
              <p className="text-sm text-gray-500">{item.status}</p> */}
              <p className={`p-4 rounded-xl ${getColor(item.status)}`}></p>
            </div>

            <button
              className="bg-black text-white px-3 py-2 rounded-lg"
              onClick={() => handleRevise(item)}
            >
              Revise Now
            </button>
          </div>
        ))
      )}

      <button
        className="bg-black text-white px-4 py-2 rounded-xl"
        onClick={() => router.push("/teach")}
      >
        Start Learning
      </button>
    </main>
  );
}
