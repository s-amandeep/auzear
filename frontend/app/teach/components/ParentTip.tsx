export default function ParentTip({ tip }: { tip: string }) {
  if (!tip) return null;

  return (
    <div className="bg-yellow-50 p-3 rounded-xl w-full max-w-lg mt-3">
      <p className="text-xs text-gray-500 mb-1">Teaching Tip</p>
      <p className="text-sm text-gray-800">💡 {tip}</p>
    </div>
  );
}