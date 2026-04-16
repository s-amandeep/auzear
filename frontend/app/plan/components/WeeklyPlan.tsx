export default function WeeklyPlan({ items }: any) {
  if (!items?.length) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      

      {items.map((item: any, i: number) => (
        <div
          key={i}
          className="p-4 bg-white rounded-2xl shadow-md w-full max-w-xl hover:shadow-lg transition"
        >
          {/* {item.concept} - {item.subject} */}
          <p>{item.concept}</p>
          <p className="text-xs text-gray-500">
            {item.subject} • {new Date(item.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>

    
    // <h2 className="text-xl font-semibold">Weekly Plan</h2>
    //   {items.map((item: any, i: number) => (
    //     <div
    //       key={i}
    //       className="p-3 bg-white rounded-xl shadow-sm w-full max-w-md"
    //     >
    //       {/* {item.concept} - {item.subject} */}
    //       <p>{item.concept}</p>
    //       <p className="text-xs text-gray-500">
    //         {item.subject} • {new Date(item.date).toLocaleDateString()}
    //       </p>
    //     </div>
    //   ))}
    
  );
}