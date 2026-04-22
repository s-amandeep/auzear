import { useRouter } from "next/navigation";

export default function UpcomingRevision({ items }: any) {
  const router = useRouter();
  const getStyles = (status: string) => {
    if (status === "strong") {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Strong Understanding ⭐",
      };
    }
    if (status === "medium") {
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Building Up 💪",
      };
    }
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      label: "Needs Support 🌱",
    };
  };

  const getStatus = (memory: number) => {
    if (memory < 0.4) return "low";
    if (memory < 0.7) return "medium";
    return "strong";
  };

  // if (!items?.length) return null;
  const handleRevise = (item: any) => {
    // router.push(`/revise?concept=${item.conceptName}`);
    router.push(`/revise/${encodeURIComponent(item.conceptName)}`);
  };

  const handleRevisit = (item: any) => {
    router.push(
      `/teach?topic=${encodeURIComponent(item.conceptName)}&mode=revisit`,
    );
  };

  return (
    <div className="flex max-w-xl flex-col items-center gap-4 w-full">
      {!items || items.length === 0 ? (
        <p className="text-gray-500">Great job! No upcoming revisions 🎉</p>
      ) : (
        items.map((item: any, index: number) => {
          const style = getStyles(getStatus(item.memory_strength));

          return (
            <div
              key={index}
              className={`w-full p-5 rounded-2xl shadow-md ${style.bg}`}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{item.conceptName}</p>
                {/* {item.memory_strength < 0.4 && (
                  <span className="text-xs text-red-500">
                    Needs Immediate Attention
                  </span>
                )} */}

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
                  Practice
                </button>
                <button
                  className="text-xs text-gray-600 underline mt-2"
                  onClick={() => handleRevisit(item)}
                >
                  Revisit Last Session
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
