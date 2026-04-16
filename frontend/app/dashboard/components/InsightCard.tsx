export default function InsightCard({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-blue-50 p-4 rounded-xl w-full max-w-md">
      <p className="text-sm text-gray-500">Insight</p>
      <p className="font-medium">{text}</p>
    </div>
  );
}