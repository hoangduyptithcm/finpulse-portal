export default function MarketBox() {
  const rows = [
    { name: "VN-Index", price: "1.292,40", change: "+0,67%", isUp: true },
    { name: "VN30", price: "1.335,20", change: "+0,84%", isUp: true },
    { name: "HNX", price: "238,15", change: "-0,19%", isUp: false },
    { name: "Bitcoin", price: "97.420", change: "+3,85%", isUp: true },
    { name: "Ethereum", price: "2.890", change: "+2,40%", isUp: true },
    { name: "USD/VND", price: "25.480", change: "+0,05%", isUp: true },
  ];

  return (
    <div className="border border-stone-200 bg-white p-4 rounded-sm">
      <h3 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-stone-200">
        Thị trường
      </h3>

      <div className="divide-y divide-stone-100 text-xs">
        {rows.map((row, i) => (
          <div key={i} className="py-2 flex items-center justify-between">
            <span className="font-medium text-stone-800">{row.name}</span>
            <div className="flex items-center space-x-3 font-mono">
              <span className="text-stone-700">{row.price}</span>
              <span
                className={`w-14 text-right font-medium ${
                  row.isUp ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {row.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
