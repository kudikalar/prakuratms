import Payment from "../models/Payment.js";

/* ================= GET ALL PAYMENTS ================= */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/* ================= ADD / UPDATE PAYMENT ================= */
export const addPayment = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      courseId,
      batchId,
      amount,
      total,
      mode,
    } = req.body;

    if (!studentId || !amount) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    let payment = await Payment.findOne({ studentId });

    if (!payment) {
      payment = new Payment({
        studentId,
        studentName,
        courseId,
        batchId,
        total,
        paid: 0,
        history: [],
      });
    }

    payment.total = total;
    payment.paid += Number(amount);

    payment.history.push({
      amount: Number(amount),
      mode: mode || "MANUAL",
      date: new Date().toISOString(),
    });

    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to save payment" });
  }
};

/* ================= DELETE PAYMENT ================= */
export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const deleted = await Payment.findByIdAndDelete(paymentId);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Payment not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
