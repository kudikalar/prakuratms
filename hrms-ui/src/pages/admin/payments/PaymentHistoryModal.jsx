export function PaymentHistoryModal({ student, payments, onClose }) {
  const history = payments[student.id]?.history || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          Payment History – {student.name}
        </h3>

        <div className="max-h-64 overflow-y-auto border rounded-lg">
          {history.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">
              No payments recorded
            </p>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between p-3 border-b text-sm"
              >
                <div>
                  ₹{h.amount}
                  <span className="block text-xs text-slate-500">
                    {h.mode}
                  </span>
                </div>
                <span>{h.date}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
