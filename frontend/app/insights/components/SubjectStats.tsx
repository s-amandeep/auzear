type Props = {
  data: {
    subject: string;
    avgMemory: number;
  }[];
};

export default function SubjectStats({ data }: Props) {
  if (!data?.length) return null;

  return (
    <div className="bg-white p-5 rounded-2xl shadow w-full max-w-md">
      <p className="text-sm text-gray-500 mb-3">
        Subject Performance
      </p>

      {data.map((item, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between text-sm">
            <span>{item.subject}</span>
            <span>{Math.round(item.avgMemory * 100)}%</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="h-2 bg-black rounded-full"
              style={{ width: `${item.avgMemory * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}