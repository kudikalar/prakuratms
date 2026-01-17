import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true, // 🔥 VERY IMPORTANT
      index: true,
    },

    studentName: { type: String, required: true },
    courseId: { type: String, required: true },
    batchId: { type: String, required: true },

    total: { type: Number, default: 45000 },
    paid: { type: Number, default: 0 },

    history: [
      {
        amount: { type: Number, required: true },
        mode: { type: String, default: "MANUAL" },
        date: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
