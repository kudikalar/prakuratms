export function PaymentHistoryModal({ student, payments = {}, onClose }) {
  if (!student) return null;

  const history = payments?.[student.id]?.history || [];

  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-IN").format(amt);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className="
          bg-white
          w-[92%] sm:w-[420px]
          rounded-2xl
          p-6
          space-y-4
          shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <h3 className="text-lg font-semibold text-slate-800">
          Payment History – {student.name}
        </h3>

        {/* HISTORY LIST */}
        <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
          {history.length === 0 ? (
            <p className="p-4 text-sm text-slate-500 text-center">
              No payments recorded
            </p>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                className="
                  flex justify-between items-center
                  p-3
                  text-sm
                  gap-3
                "
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    ₹{formatAmount(h.amount)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {h.mode || "—"}
                  </span>
                </div>

                {/* RIGHT */}
                <span className="text-xs text-slate-600 whitespace-nowrap">
                  {h.date || "—"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              rounded-lg
              bg-purple-600
              hover:bg-purple-700
              text-white
              text-sm
              font-semibold
              transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
