function AddPaymentModal({ student, onClose, onSave }) {
  const [total, setTotal] = useState(student.total || 0);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");

  const due = total - student.paid;

  const handleSave = () => {
    if (total < student.paid) {
      alert("Total amount cannot be less than paid amount");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Enter valid payment amount");
      return;
    }

    if (amount > due) {
      alert("Amount exceeds due");
      return;
    }

    onSave({
      studentId: student.studentId,
      total,              // ✅ SAVED
      amount,
      mode,
      date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl p-6 space-y-4 shadow-xl">

        <h3 className="text-lg font-semibold">Add / Update Payment</h3>

        {/* TOTAL / PAID / DUE */}
        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span>Total Fee</span>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              className="w-28 px-2 py-1 border rounded text-right font-semibold"
            />
          </div>

          <div className="flex justify-between">
            <span>Paid</span>
            <span className="text-emerald-600 font-semibold">
              ₹{student.paid}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Due</span>
            <span className="text-red-600 font-semibold">
              ₹{due}
            </span>
          </div>
        </div>

        <input
          type="number"
          placeholder="Payment Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option>UPI</option>
          <option>Cash</option>
          <option>Card</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
