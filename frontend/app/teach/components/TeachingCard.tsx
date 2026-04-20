type Props = {
  topic: string;
  teach: string;
};

export default function TeachingCard({ topic, teach }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg">
      {/* <p className="text-xs text-gray-500">{subject}</p> */}
      {/* <h2 className="text-xl font-semibold mb-4">{topic}</h2> */}

      <p className="text-sm text-gray-500 mb-1">How to explain this simply 👇</p>
      {/* <p className="text-xs text-gray-400 mb-1">A simple way to explain this</p> */}
      <p className="text-gray-800 leading-relaxed">{teach}</p>
    </div>
  );
}
