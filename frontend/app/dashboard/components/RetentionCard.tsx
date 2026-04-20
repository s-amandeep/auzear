export default function RetentionCard({ score }: { score: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-md">
      {/* <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6"> */}

      {/* <p className="text-gray-500">Retention Score</p> */}

      {/* <p className="text-4xl font-bold mt-2">{score}%</p> */}

      <p className="text-xs text-gray-500">Based on recent understanding</p>
      <p className="text-sm text-gray-500 mt-2">
        {score > 80
          ? "Strong Understanding ⭐"
          : score > 60
            ? "Building Up 💪"
            : score > 40
              ? "Needs Support 🌱"
              : "You are doing great! 🤝"}
      </p>
    </div>
  );
}
