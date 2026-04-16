export default function QuestionsCard({ questions }: any) {
  if (!questions?.length) return null;

  return (
    <div className="w-full max-w-lg mt-3">
      <p className="text-sm text-gray-500 mb-2">Ask your child</p>

      {questions.map((q: string, i: number) => (
        <p key={i} className="text-sm mb-1">
          • {q}
        </p>
      ))}
    </div>
  );
}