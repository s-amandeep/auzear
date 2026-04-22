"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6 bg-gray-50">
      
      {/* Brand */}
      <h1 className="text-3xl font-bold">
        Auzear
      </h1>

      {/* Headline */}
      <p className="text-lg text-gray-700 max-w-md">
        Help your child truly understand — not just memorize.
      </p>

      {/* Subtext */}
      <p className="text-sm text-gray-500 max-w-sm">
        Simple explanations, smart revision, and clear progress — all in one place.
      </p>

      {/* Primary CTA */}
      <button
        onClick={() => router.push("/teach")}
        className="mt-4 bg-black text-white px-6 py-3 rounded-xl w-full max-w-xs"
      >
        Start with a Topic
      </button>

      {/* Secondary CTA */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-sm text-gray-600 underline"
      >
        View Progress Dashboard
      </button>

      {/* Trust line */}
      <p className="text-xs text-gray-400 mt-4">
        You don’t need to be perfect — just consistent 💛
      </p>
    </main>
  );
}