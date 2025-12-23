import {
  FaUserGraduate,
  FaPhone,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

/* ================= MOCK STUDENT DATA (API READY) ================= */

const student = {
  id: 1,
  name: "Ramesh",
  phone: "+91 98765 43210",
  course: "Data Science",
  batch: "DS-2024-B",
  totalFee: 70000,
  payments: [
    { date: "2024-06-01", amount: 15000, mode: "UPI" },
    { date: "2024-07-10", amount: 15000, mode: "Cash" },
  ],
};

/* ================= DERIVED VALUES ================= */

const paidAmount = student.payments.reduce((s, p) => s + p.amount, 0);
const dueAmount = student.totalFee - paidAmount;

const pieData = [
  { name: "Paid", value: paidAmount },
  { name: "Due", value: dueAmount },
];

const COLORS = ["#22c55e", "#ef4444"];

/* ================= PAGE ================= */

export default function StudentPaymentDetails() {
  return (
    <div className="space-y-8 animate-fadeIn">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Student Payment Details
        </h2>
        <p className="text-slate-500">
          Complete payment tracking & history
        </p>
      </div>

      {/* STUDENT INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <InfoCard
          icon={<FaUserGraduate />}
          label="Student"
          value={student.name}
        />

        <InfoCard
          icon={<FaPhone />}
          label="Phone"
          value={student.phone}
        />

        <InfoCard
          icon={<FaMoneyBillWave />}
          label="Total Fee"
          value={`₹${student.totalFee}`}
        />
      </div>

      {/* COURSE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Course" value={student.course} />
        <Stat label="Batch" value={student.batch} />
        <Stat label="Amount Due" value={`₹${dueAmount}`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <Card>
          <h3 className="font-semibold mb-4 text-slate-700">
            Fee Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* BAR CHART */}
        <Card>
          <h3 className="font-semibold mb-4 text-slate-700">
            Payment History
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={student.payments}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* PAYMENT TABLE */}
      <Card>
        <h3 className="font-semibold mb-4 text-slate-700">
          Payment Records
        </h3>

        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Mode</th>
            </tr>
          </thead>

          <tbody>
            {student.payments.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="py-2">{p.date}</td>
                <td className="py-2 font-semibold">₹{p.amount}</td>
                <td className="py-2">{p.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Card = ({ children }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
    {children}
  </div>
);

const InfoCard = ({ icon, label, value }) => (
  <Card>
    <div className="flex items-center gap-3">
      <span className="text-purple-600 text-xl">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  </Card>
);

const Stat = ({ label, value }) => (
  <Card>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-lg font-semibold text-slate-800">{value}</p>
  </Card>
);
