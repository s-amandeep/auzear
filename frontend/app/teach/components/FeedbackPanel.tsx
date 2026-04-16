type Props = {
  engagement: string;
  setEngagement: (val: any) => void;
  onImprove: () => void;
  onDone: () => void;
};

export default function FeedbackPanel({
  engagement,
  setEngagement,
  onImprove,
  onDone,
}: Props) {
  const options = [
    { label: "😕", value: "low" as const, text: "Didn't understand" },
    { label: "🤔", value: "medium" as const, text: "Partially understood" },
    { label: "😊", value: "high" as const, text: "Understood well" },
    { label: "😄", value: "very_high" as const, text: "Enjoyed it" },
  ];

  const getButtonText = () => {
    if (engagement === "low") return "Improve Explanation";
    if (engagement === "medium") return "Explain Better";
    if (engagement === "high") return "Make it Stronger";
    if (engagement === "very_high") return "Challenge Further";
    return "";
  };

  return (
    <div className="mt-6 w-full max-w-lg">
      <p className="text-sm text-gray-500 mb-2">
        How did your child respond?
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

      {engagement && (
        <>
          <button
            className="mt-4 bg-black text-white px-4 py-2 rounded-xl"
            onClick={onImprove}
          >
            {getButtonText()}
          </button>

          <button
            className="mt-2 border px-4 py-2 rounded-xl"
            onClick={onDone}
          >
            Done for now
          </button>
        </>
      )}
    </div>
  );
}