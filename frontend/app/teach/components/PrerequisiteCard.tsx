export default function PrerequisiteCard({ data }: any) {
  if (!data) return null;

  return (
    <div className="bg-red-50 p-3 rounded-xl w-full max-w-lg mt-3">
      <p className="text-xs text-gray-500 mb-1">Before this, ensure they understand:</p>
      <p className="text-sm font-medium">{data.concept}</p>
      <p className="text-sm text-gray-700">{data.explain}</p>
    </div>
  );
}