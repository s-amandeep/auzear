import { useRouter } from "next/navigation";

export default function TodayRevisionCard({ items }: any) {
  const router = useRouter();
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

  const handleRevise = (item: any) => {
    // router.push(`/revise?concept=${item.conceptName}`);
    router.push(`/revise/${encodeURIComponent(item.conceptName)}`);
  };

  return (
    // <div className="bg-white p-4 rounded-xl shadow w-full max-w-md">
    <div className="w-full max-w-xl bg-black text-white rounded-2xl p-6">
      <p className="text-lg font-semibold">
        {items.length > 0
          ? `Today ${items.length} concept(s) need attention`
          : "Great job! You're all caught up. No pending revisions today 🎉"}
      </p>

      <div className="w-full max-w-xl bg-black text-white rounded-2xl p-6">
        <div className="flex flex-col gap-3 mt-4">
          {!items || items.length === 0 ? (
            <button
              className="bg-white text-black px-4 py-2 rounded-xl"
              onClick={() => router.push("/teach")}
            >
              Teach Something New
            </button>
          ) : (
            items.map((item: any, index: number) => {
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

                    {/* {item.memory_strength < 0.4 && (
                      <span className="text-xs text-red-500">
                        Needs Immediate Attention
                      </span>
                    )} */}

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
    </div>
  );
}
