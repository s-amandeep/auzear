export default function TeachingCard({ data }: any) {
  if (!data) return null;

  return (
    <div className="mt-6 p-6 border rounded-xl w-full max-w-md bg-white shadow">
      <pre className="whitespace-pre-wrap text-sm">{data}</pre>
    </div>
  );
}