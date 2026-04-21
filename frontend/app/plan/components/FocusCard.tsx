export default function FocusCard({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-blue-50 p-5 rounded-2xl w-full shadow-md max-w-xl">         

      <p className="font-semibold">
        {text}
      </p>
    </div>    
  );
}