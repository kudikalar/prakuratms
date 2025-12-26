import { FaWhatsapp } from "react-icons/fa";

/* ================= COMPONENT ================= */

export default function OverdueAlerts({ rows = [] }) {
  /* ================= SAFE FILTER ================= */
  const overdue = Array.isArray(rows)
    ? rows.filter(
        (r) =>
          r &&
          r.status === "OVERDUE" &&
          Number(r.due) > 0
      )
    : [];

  if (overdue.length === 0) return null;

  /* ================= FORMATTER ================= */
  const formatAmount = (amt) =>
    `₹${new Intl.NumberFormat("en-IN").format(amt || 0)}`;

  /* ================= WHATSAPP ================= */
  const sendWhatsApp = (s) => {
    if (!s?.phone || s.phone === "—") return;

    const msg = `Hello ${s.name},
Your pending fee of ${formatAmount(
      s.due
    )} is overdue.
Please complete the payment at the earliest.`;

    window.open(
      `https://wa.me/91${s.phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <div
      className="
        bg-white/40 backdrop-blur-xl
        border border-red-200/60
        rounded-3xl p-6
        shadow-[0_20px_60px_rgba(220,38,38,0.25)]
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-red-700 flex items-center gap-2">
          🔔 Overdue Payments
        </h3>

        <span
          className="
            text-xs font-bold
            bg-red-200 text-red-900
            px-2 py-0.5 rounded-full
          "
        >
          {overdue.length}
        </span>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-3 text-sm">
        {overdue.map((s) => {
          const hasPhone = s.phone && s.phone !== "—";

          return (
            <div
              key={s.id}
              className="
                flex flex-col sm:flex-row
                sm:items-center sm:justify-between
                gap-3
                bg-white/70 backdrop-blur
                rounded-2xl px-4 py-3
                border border-white/50
                shadow-sm
              "
            >
              {/* NAME + AMOUNT */}
              <div>
                <p className="font-medium text-slate-800">
                  {s.name}
                </p>
                <p className="text-red-600 text-xs font-semibold">
                  {formatAmount(s.due)} overdue
                </p>
              </div>

              {/* ACTION */}
              <button
                onClick={() => sendWhatsApp(s)}
                disabled={!hasPhone}
                className="
                  flex items-center justify-center
                  gap-2
                  px-4 py-2
                  rounded-full
                  bg-green-100 text-green-700
                  hover:bg-green-200
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                "
                title={
                  hasPhone
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
          );
        })}
      </div>
    </div>
  );
}
