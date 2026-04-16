export default function RetentionCard({ score }: { score: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-md">
    {/* <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6"> */}

      <p className="text-gray-500">Retention Score</p>

      <p className="text-4xl font-bold mt-2">{score}%</p>

      <p className="text-sm text-gray-500 mt-2">
        {score > 80
          ? "Excellent retention"
          : score > 60
            ? "Good progress"
            : score > 40
              ? "Needs attention"
              : "At risk of forgetting"}
      </p>
    </div>
  );
}
