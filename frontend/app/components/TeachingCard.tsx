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

      {/* <div>
        <h2 className="font-semibold text-gray-700">Analogy</h2>
        <p>{data.analogy}</p>
      </div>

      <div>
        <h2 className="font-semibold text-gray-700">Example</h2>
        <p>{data.example}</p>
      </div>

      <div className="bg-blue-50 p-3 rounded-xl">
        <h2 className="font-semibold text-blue-700">Say this to your child</h2>
        <p>{data.parent_instruction}</p>
      </div> */}
    // </div>
 