"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [revisionList, setRevisionList] = useState([]);

  useEffect(() => {
    fetchRevision();
  }, []);

  const fetchRevision = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/revision/1111-2222`,
      );

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setRevisionList(data);
      } catch {
        console.error("Not JSON:", text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Today's Revision</h1>

      {!revisionList || revisionList.length === 0 ? (
        <p>No revisions due 🎉</p>
      ) : (
        revisionList.map((item: any, index) => (
          <div key={index} className="p-4 border rounded w-full max-w-md">
            <p className="font-semibold">{item.concepts?.name}</p>
            <p>Status: {item.status}</p>
          </div>
        ))
      )}
    </main>
  );
}
