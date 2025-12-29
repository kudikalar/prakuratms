import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

/* ============================================================================
   ATTENDANCE CALENDAR – SCHOOL REGISTER STYLE
   ✔ Month diary layout
   ✔ Colored squares: Present/Absent/Late
   ✔ Week rows (Mon–Sun)
   ✔ Smooth animations + Prakura theme
============================================================================ */

export default function AttendanceCalendar() {
  const [month, setMonth] = useState(new Date());
  const [records, setRecords] = useState({});

  /* ================= MOCK DATA ================= */
  useEffect(() => {
    // Replace with real API call
    setRecords({
      "2025-01-02": "Present",
      "2025-01-03": "Present",
      "2025-01-04": "Absent",
      "2025-01-05": "Present",
      "2025-01-06": "Late",
      "2025-01-07": "Present",
      "2025-01-08": "Present",
      "2025-01-11": "Absent",
    });
  }, []);

  /* ================= HELPERS ================= */
  const formatDate = (date) => date.toISOString().split("T")[0];

  const changeMonth = (direction) => {
    const newDate = new Date(month);
    newDate.setMonth(month.getMonth() + direction);
    setMonth(newDate);
  };

  const getCalendarDays = () => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    const days = [];
    const startOffset = (firstDay.getDay() + 6) % 7; // Convert Sun=0 → Sun=6
    const totalDays = lastDay.getDate();

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, monthIndex, i));

    return days;
  };

  const statusMap = {
    Present: { bg: "bg-emerald-100", color: "text-emerald-700", icon: <FaCheckCircle /> },
    Absent: { bg: "bg-red-100", color: "text-red-700", icon: <FaTimesCircle /> },
    Late: { bg: "bg-yellow-100", color: "text-yellow-700", icon: <FaClock /> },
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100 animate-fadeIn">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
        >
          <FaChevronLeft />
        </button>

        <h2 className="text-xl font-bold text-slate-800">
          {month.toLocaleString("default", { month: "long" })} {month.getFullYear()}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* ================= WEEK HEADER ================= */}
      <div className="grid grid-cols-7 text-center text-slate-500 text-xs mb-2 font-medium">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      {/* ================= CALENDAR GRID ================= */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx}></div>;

          const dateStr = formatDate(day);
          const status = records[dateStr];
          const s = statusMap[status];

          return (
            <div
              key={idx}
              className={`
                h-16 rounded-xl border shadow-sm
                flex flex-col items-center justify-center
                text-xs font-medium select-none
                transition hover:scale-[1.05]
                ${
                  status
                    ? `${s.bg} ${s.color} border-transparent`
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }
              `}
            >
              <span className="text-[11px]">{day.getDate()}</span>
              {status && <span className="text-lg mt-1">{s.icon}</span>}
            </div>
          );
        })}
      </div>

      {/* ================= LEGEND ================= */}
      <div className="flex items-center gap-6 mt-6 text-xs">
        <Legend color="bg-emerald-100" label="Present" />
        <Legend color="bg-red-100" label="Absent" />
        <Legend color="bg-yellow-100" label="Late" />
        <Legend color="bg-slate-200" label="No Entry" />
      </div>
    </div>
  );
}

/* LEGEND ITEM */
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded ${color} border border-slate-300`}></span>
    <span className="text-slate-600">{label}</span>
  </div>
);
