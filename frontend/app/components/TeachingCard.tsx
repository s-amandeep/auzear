export default function TeachingCard({ data }: any) {
  if (!data) return null;

  return (
    // <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-4">
    <div className="bg-white p-5 rounded-xl shadow max-w-md">
      <div>
        <h2 className="font-semibold mb-2">How to Teach</h2>
        <p>{data}</p>
      </div>
      </div>
       );
}