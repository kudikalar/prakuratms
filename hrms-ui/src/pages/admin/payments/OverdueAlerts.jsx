import { FaWhatsapp } from "react-icons/fa";

export default function OverdueAlerts({ rows = [] }) {
  /* ================= SAFE FILTER ================= */
  const overdue = Array.isArray(rows)
    ? rows.filter((r) => r.status === "OVERDUE" && r.due > 0)
    : [];

  if (overdue.length === 0) return null;

  /* ================= FORMATTER ================= */
  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-IN").format(amt);

  /* ================= WHATSAPP ================= */
  const sendWhatsApp = (s) => {
    if (!s.phone || s.phone === "—") return;

    const msg = `Hello ${s.name}, your payment of ₹${formatAmount(
      s.due
    )} is overdue. Please complete it at the earliest.`;

    window.open(
      `https://wa.me/91${s.phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
      {/* HEADER */}
      <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
        🔔 Overdue Payments
        <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
          {overdue.length}
        </span>
      </h3>

      {/* LIST */}
      <div className="space-y-2 text-sm">
        {overdue.map((s) => (
          <div
            key={s.id}
            className="
              flex flex-col sm:flex-row
              sm:items-center sm:justify-between
              gap-2
              bg-white rounded-lg px-4 py-3
              shadow-sm
            "
          >
            {/* NAME + AMOUNT */}
            <div className="flex flex-col">
              <span className="font-medium text-slate-800">
                {s.name}
              </span>
              <span className="text-red-600 text-sm">
                ₹{formatAmount(s.due)} overdue
              </span>
            </div>

            {/* ACTION */}
            <button
              onClick={() => sendWhatsApp(s)}
              disabled={!s.phone || s.phone === "—"}
              className="
                flex items-center justify-center
                gap-2
                px-3 py-2
                rounded-full
                bg-green-100 text-green-700
                hover:bg-green-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition
              "
              title={
                s.phone && s.phone !== "—"
                  ? "Send WhatsApp reminder"
                  : "Phone number not available"
              }
            >
              <FaWhatsapp className="text-lg" />
              <span className="text-xs font-semibold hidden sm:block">
                WhatsApp
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
