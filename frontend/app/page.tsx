"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Welcome to Auzear</h1>

      <button
        onClick={() => router.push("/teach")}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Start Teaching
      </button>

      <button onClick={() => router.push("/dashboard")}>View Dashboard</button>
    </main>
  );
}
