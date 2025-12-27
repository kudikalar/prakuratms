import { useEffect, useState, useMemo } from "react";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaFire,
  FaInfoCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT ATTENDANCE PAGE (ENTERPRISE | PRODUCTION)
===================================================== */

export default function StudentAttendance() {
  const [summary, setSummary] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState("2025-01");

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    const mockRecords = [
      { date: "2025-01-02", status: "Present" },
      { date: "2025-01-03", status: "Present" },
      { date: "2025-01-04", status: "Absent" },
      { date: "2025-01-05", status: "Present" },
      { date: "2025-01-06", status: "Late" },
      { date: "2025-01-07", status: "Present" },
    ];

    const present = mockRecords.filter(r => r.status === "Present").length;
    const absent = mockRecords.filter(r => r.status === "Absent").length;
    const late = mockRecords.filter(r => r.status === "Late").length;
    const totalDays = mockRecords.length;
    const percentage = totalDays
      ? Math.round((present / totalDays) * 100)
      : 0;

    setRecords(mockRecords);
    setSummary({
      totalDays,
      present,
      absent,
      late,
      percentage,
    });
  }, [month]);

  /* ================= DERIVED ================= */

  const eligible = summary.percentage >= 75;

  const trend = summary.percentage >= 75 ? "UP" : "DOWN";

  const riskLevel =
    summary.percentage >= 85
      ? "SAFE"
      : summary.percentage >= 75
      ? "WARNING"
      : "RISK";

  const streak = useMemo(() => {
    let count = 0;
    for (let i = records.length - 1; i >= 0; i--) {
      if (records[i].status === "Present") count++;
      else break;
    }
    return count;
  }, [records]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Attendance
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track daily attendance, trends & eligibility
            </p>
          </div>

          {/* MONTH FILTER */}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 rounded-xl border bg-white text-sm"
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Stat label="Total Days" value={summary.totalDays} />
        <Stat label="Present" value={summary.present} />
        <Stat label="Absent" value={summary.absent} />
        <Stat label="Late" value={summary.late} />
        <Stat
          label="Attendance %"
          value={`${summary.percentage}%`}
          highlight
        />
      </div>

      {/* INSIGHTS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ELIGIBILITY */}
        <GlassInfo
          icon={eligible ? <FaCheckCircle /> : <FaExclamationTriangle />}
          title={eligible ? "Eligible" : "Not Eligible"}
          subtitle={
            eligible
              ? "Eligible for exams & placements"
              : "Attendance below 75%"
          }
          color={eligible ? "emerald" : "red"}
        />

        {/* STREAK */}
        <GlassInfo
          icon={<FaFire />}
          title={`${streak} Day Streak`}
          subtitle="Continuous presence"
          color="orange"
        />

        {/* RISK */}
        <GlassInfo
          icon={<FaInfoCircle />}
          title={
            riskLevel === "SAFE"
              ? "Safe Zone"
              : riskLevel === "WARNING"
              ? "Warning Zone"
              : "Risk Zone"
          }
          subtitle="Attendance health"
          color={
            riskLevel === "SAFE"
              ? "emerald"
              : riskLevel === "WARNING"
              ? "yellow"
              : "red"
          }
        />
      </div>

      {/* ELIGIBILITY BANNER */}
      <div
        className={`
          flex items-center gap-3 p-5 rounded-2xl shadow
          border border-white/40
          ${eligible ? "bg-emerald-50" : "bg-red-50"}
        `}
      >
        {eligible ? (
          <>
            <FaCheckCircle className="text-emerald-600 text-xl" />
            <span className="text-sm font-semibold text-emerald-700">
              Eligible for Exams & Placements
            </span>
          </>
        ) : (
          <>
            <FaExclamationTriangle className="text-red-600 text-xl" />
            <span className="text-sm font-semibold text-red-700">
              Attendance below 75% – Immediate improvement required
            </span>
          </>
        )}

        <span className="ml-auto flex items-center gap-1 text-xs text-slate-600">
          {trend === "UP" ? (
            <>
              <FaArrowUp className="text-emerald-600" /> Improving
            </>
          ) : (
            <>
              <FaArrowDown className="text-red-600" /> Needs Improvement
            </>
          )}
        </span>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <h3 className="font-semibold text-slate-800 mb-4">
          Attendance Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 hover:bg-white/60"
                >
                  <td className="py-3 text-slate-700">
                    {new Date(r.date).toDateString()}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!records.length && (
          <p className="text-sm text-slate-400 text-center mt-4">
            No attendance data available
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Stat = ({ label, value, highlight }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border border-white/40">
    <p className="text-sm text-slate-500">{label}</p>
    <h3
      className={`text-2xl font-bold mt-1 ${
        highlight ? "text-emerald-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const GlassInfo = ({ icon, title, subtitle, color }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow border border-white/40">
    <div className={`text-${color}-600 text-xl mb-1`}>
      {icon}
    </div>
    <p className="font-semibold text-slate-800">{title}</p>
    <p className="text-xs text-slate-500">{subtitle}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Present: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Absent: {
      icon: <FaTimesCircle />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    Late: {
      icon: <FaClock />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  };

  const s = map[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1 rounded-full text-xs font-medium
        ${s.bg} ${s.color}
      `}
    >
      {s.icon}
      {status}
    </span>
  );
};
