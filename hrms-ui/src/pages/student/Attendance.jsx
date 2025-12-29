import { useState, useEffect, useMemo } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

/* =========================================================================
   STUDENT ATTENDANCE – PRAKURA PURPLE CORPORATE (ANIMATED PREMIUM EDITION)
   ✔ Enhanced Glassmorphism
   ✔ Smooth Animations
   ✔ Hover Effects
   ✔ Calendar Pop Animation
========================================================================= */

export default function StudentAttendance() {
  const [month, setMonth] = useState("2025-01");
  const [student] = useState({
    name: "Ramesh Kumar",
    email: "ramesh.kumar@prakura.com",
    roll: "PKR1029",
    batch: "Jan 2025",
  });

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  /* ================= INIT MOCK DATA ================= */
  useEffect(() => {
    const mock = [
      { date: "2025-01-02", status: "Present" },
      { date: "2025-01-03", status: "Present" },
      { date: "2025-01-04", status: "Absent" },
      { date: "2025-01-05", status: "Late" },
      { date: "2025-01-06", status: "Present" },
      { date: "2025-01-07", status: "Present" },
    ];

    const present = mock.filter(x => x.status === "Present").length;
    const absent = mock.filter(x => x.status === "Absent").length;
    const late = mock.filter(x => x.status === "Late").length;
    const totalDays = mock.length;

    setRecords(mock);
    setSummary({
      totalDays,
      present,
      absent,
      late,
      percentage: totalDays ? Math.round((present / totalDays) * 100) : 0,
    });
  }, [month]);

  /* ================= UTILS ================= */
  const initials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const generateCalendar = useMemo(() => {
    const [year, m] = month.split("-");
    const date = new Date(year, m - 1, 1);

    let days = [];
    while (date.getMonth() === Number(m) - 1) {
      days.push({
        date: new Date(date),
        status:
          records.find(
            (r) => r.date === date.toISOString().split("T")[0]
          )?.status || "NA",
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [month, records]);

  /* ================= STATUS COLORS ================= */
  const statusStyles = {
    Present:
      "bg-emerald-100 text-emerald-700 border-emerald-300 shadow-lg shadow-emerald-200/30 animate-softPop",
    Absent:
      "bg-red-100 text-red-700 border-red-300 shadow-lg shadow-red-200/30 animate-softPop",
    Late:
      "bg-yellow-100 text-yellow-700 border-yellow-300 shadow-lg shadow-yellow-200/30 animate-softPop",
    NA: "bg-slate-100 text-slate-500 border-slate-300",
  };

  /* ================= UI ================== */
  return (
    <div className="space-y-8 animate-fadeInSlow">

      {/* STUDENT HEADER CARD */}
      <div
        className="
        bg-white/20 backdrop-blur-2xl border border-white/30 
        rounded-3xl p-6 shadow-[0_0_40px_rgba(80,0,160,0.2)]
        flex flex-col md:flex-row items-center gap-6
        animate-slideUp
      "
      >
        {/* Avatar */}
        <div
          className="
          w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold
          bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl
          border border-white/30
        "
        >
          {initials(student.name)}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 drop-shadow-sm">
            {student.name}
          </h2>

          <p className="text-sm text-slate-600">{student.email}</p>

          <div className="flex gap-6 text-sm mt-2 text-slate-700">
            <span>Roll: <strong>{student.roll}</strong></span>
            <span>Batch: <strong>{student.batch}</strong></span>
          </div>
        </div>

        {/* Month Picker */}
        <div className="animate-popIn">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="
              px-4 py-2 rounded-xl border shadow-lg 
              bg-white/40 backdrop-blur-md 
              focus:ring-2 focus:ring-purple-400
            "
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <AnimatedSummary
          label="Present"
          value={summary.present}
          icon={<FaCheckCircle />}
          color="emerald"
          delay="100ms"
        />

        <AnimatedSummary
          label="Absent"
          value={summary.absent}
          icon={<FaTimesCircle />}
          color="red"
          delay="200ms"
        />

        <AnimatedSummary
          label="Late"
          value={summary.late}
          icon={<FaClock />}
          color="yellow"
          delay="300ms"
        />

        <AnimatedSummary
          label="Overall %"
          value={`${summary.percentage}%`}
          icon={<FaCalendarAlt />}
          color="purple"
          delay="400ms"
        />
      </div>

      {/* HEALTH BAR */}
      <div
        className="
        bg-white/20 backdrop-blur-2xl border border-white/30 shadow-xl 
        p-6 rounded-3xl animate-slideUp delay-300
      "
      >
        <h3 className="font-semibold text-slate-800 mb-4">
          Attendance Health
        </h3>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-slate-300/40 overflow-hidden">
            <div
              className="
              h-full bg-gradient-to-r from-emerald-500 to-purple-600
              animate-growBar 
            "
              style={{ width: `${summary.percentage}%` }}
            />
          </div>

          <span className="text-sm text-slate-700">
            {summary.percentage >= 75 ? (
              <span className="flex items-center gap-1 text-emerald-600 animate-pulseSlow">
                <FaArrowUp /> Good
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 animate-pulseSlow">
                <FaArrowDown /> Low
              </span>
            )}
          </span>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      <div
        className="
        bg-white/20 backdrop-blur-2xl border border-white/30 
        shadow-2xl rounded-3xl p-6 animate-slideUp delay-500
      "
      >
        <h3 className="font-semibold text-slate-800 mb-6">
          Attendance Calendar
        </h3>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-600 mb-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="animate-fadeIn">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 text-center">
          {generateCalendar.map((day, idx) => (
            <div
              key={idx}
              className={`
                p-3 rounded-xl border text-xs
                transition transform hover:scale-[1.07]
                duration-300 cursor-pointer
                ${statusStyles[day.status]}
              `}
            >
              <p className="font-bold">{day.date.getDate()}</p>
              <p className="text-[10px]">{day.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SUMMARY CARD (Animated)
========================================================================= */
const AnimatedSummary = ({ label, value, icon, color, delay }) => {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-100 border-emerald-300",
    red: "text-red-600 bg-red-100 border-red-300",
    yellow: "text-yellow-600 bg-yellow-100 border-yellow-300",
    purple: "text-purple-600 bg-purple-100 border-purple-300",
  };

  return (
    <div
      className={`
        bg-white/20 backdrop-blur-xl border border-white/30 
        p-6 shadow-xl rounded-3xl
        flex flex-col gap-2 animate-slideUp
      `}
      style={{ animationDelay: delay }}
    >
      <span className={`text-lg ${colors[color]} p-2 rounded-xl inline-block w-fit shadow`}>
        {icon}
      </span>
      <p className="text-sm text-slate-600">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
};
