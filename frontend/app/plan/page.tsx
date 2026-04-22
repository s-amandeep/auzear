"use client";

import { useEffect } from "react";
import { useRevision } from "../../hooks/useRevision";
import UpcomingRevision from "./components/UpcomingRevision";
import { trackEvent } from "@/lib/analytics";

export default function Plan() {
  const { startRevision, upcoming, loading } = useRevision();

  useEffect(() => {
    trackEvent("plan_clicked", {});
    startRevision();
  }, []);

  return (
    <main className="flex flex-col items-center px-4 py-6 gap-6 max-w-xl mx-auto">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Upcoming Learning</h1>
        <p className="text-sm text-gray-500 mt-1">
          What to revisit in the next few days
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-sm">
          Preparing your plan...
        </p>
      )}

      {/* Content */}
      {!loading && (
        <>
          <UpcomingRevision items={upcoming} />

          {/* Empty state */}
          {!upcoming?.length && (
            <div className="text-center mt-4">
              <p className="text-gray-500 text-sm">
                You're all set for now 🎉
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Teach a new topic to keep the momentum going
              </p>
            </div>
          )}

          {/* Emotional anchor */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Learning works best when revisited at the right time 💛
          </p>
        </>
      )}
    </main>
  );
}