export default function GuidanceCard({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-blue-50 p-5 rounded-2xl w-full max-w-md">
      <p className="text-sm text-gray-500 mb-1">
        What You Can Do
      </p>

      <p className="text-sm text-gray-800">
        💡 {text}
      </p>
    </div>
  );
}