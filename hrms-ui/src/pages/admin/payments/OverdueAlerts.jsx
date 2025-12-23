import { FaWhatsapp } from "react-icons/fa";

export default function OverdueAlerts({ rows }) {
  const overdue = rows.filter((r) => r.status === "OVERDUE");

  if (overdue.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
      <h3 className="font-semibold text-red-700 mb-3">
        🔔 Overdue Payments ({overdue.length})
      </h3>

      <div className="space-y-2 text-sm">
        {overdue.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center bg-white rounded-lg px-4 py-2"
          >
            <span>{s.name} – ₹{s.due}</span>
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/91${s.phone}?text=${encodeURIComponent(
                    `Hello ${s.name}, your payment of ₹${s.due} is overdue.`
                  )}`,
                  "_blank"
                )
              }
              className="text-green-600"
            >
              <FaWhatsapp />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
