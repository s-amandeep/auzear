export default function LearningPattern({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-red-50 p-5 rounded-2xl w-full max-w-md">
      <p className="text-sm text-gray-500 mb-1">
        Learning Pattern
      </p>

      <p className="text-sm text-gray-800">
        {text}
      </p>
    </div>
  );
}