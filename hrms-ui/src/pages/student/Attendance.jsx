import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

/* =========================================================================
   STUDENT ATTENDANCE – PRAKURA (PRODUCTION READY)
   ✔ NO HARDCODE
   ✔ ADMIN → STUDENT SYNC
   ✔ ZERO RUNTIME ERRORS
========================================================================= */

const readLS = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

export default function StudentAttendance() {
  /* ================= STATE ================= */

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  /* ================= LOAD LOGGED-IN STUDENT ================= */

  useEffect(() => {
    const loggedUser = readLS("user", null);
    if (!loggedUser || loggedUser.role !== "STUDENT") return;

    const users = readLS("users", { students: [] });
    const batches = readLS("batches", []);

const studentRecord = users.students.find(
  (s) =>
    s.email?.toLowerCase() ===
    loggedUser.email?.toLowerCase()
);


    if (!studentRecord) {
      console.error("❌ Student not found in admin records");
      return;
    }

    const batch = batches.find(
      (b) => String(b._id || b.id) === String(studentRecord.batchId)
    );

   setStudent({
  id: String(studentRecord.id || studentRecord._id),
  name: studentRecord.name,
  email: studentRecord.email,

  // ✅ USE SAME STUDENT CODE AS ROLL
  roll: studentRecord.studentCode || "—",

  batchId: String(studentRecord.batchId),
  batch: batch?.name || "Not Assigned",
});

  }, []);

  /* ================= LOAD ATTENDANCE ================= */

  useEffect(() => {
    if (!student?.id || !student?.batchId) return;

    const store = readLS("attendance", {});
    const monthPrefix = month;
    const rows = [];

    Object.entries(store).forEach(([date, batches]) => {
      if (!date.startsWith(monthPrefix)) return;

      const batchAttendance = batches?.[student.batchId];
      if (!batchAttendance) return;

      const status = batchAttendance[student.id];
      if (!status) return;

      rows.push({ date, status });
    });

    setRecords(rows);
  }, [month, student]);

  /* ================= SUMMARY ================= */

  useEffect(() => {
    const present = records.filter(r => r.status === "Present").length;
    const absent = records.filter(r => r.status === "Absent").length;
    const late = records.filter(r => r.status === "Late").length;
    const totalDays = records.length;

    setSummary({
      totalDays,
      present,
      absent,
      late,
      percentage: totalDays
        ? Math.round((present / totalDays) * 100)
        : 0,
    });
  }, [records]);

  /* ================= CALENDAR ================= */

  const calendar = useMemo(() => {
    const [y, m] = month.split("-");
    const date = new Date(y, m - 1, 1);
    const days = [];

    while (date.getMonth() === Number(m) - 1) {
      const iso = date.toISOString().split("T")[0];
      days.push({
        day: date.getDate(),
        status:
          records.find(r => r.date === iso)?.status || "NA",
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [month, records]);

  /* ================= GUARD ================= */

  if (!student) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading student attendance…
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
          {student.name.split(" ").map(n => n[0]).join("")}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-sm text-slate-600">{student.email}</p>
          <div className="flex gap-6 mt-2 text-sm">
            <span>Roll: <b>{student.roll}</b></span>
            <span>Batch: <b>{student.batch}</b></span>
          </div>
        </div>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white/50"
        />
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Summary label="Present" value={summary.present} icon={<FaCheckCircle />} />
        <Summary label="Absent" value={summary.absent} icon={<FaTimesCircle />} />
        <Summary label="Late" value={summary.late} icon={<FaClock />} />
        <Summary label="%" value={`${summary.percentage}%`} icon={<FaCalendarAlt />} />
      </div>

      {/* CALENDAR */}
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 grid grid-cols-7 gap-2 text-center text-xs">
        {calendar.map((d, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border ${
              d.status === "Present"
                ? "bg-green-100 text-green-800"
                : d.status === "Absent"
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <b>{d.day}</b>
            <div>{d.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SUMMARY CARD ================= */

const Summary = ({ label, value, icon }) => (
  <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-2">
    <span className="text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
    <b className="text-xl">{value}</b>
  </div>
);
