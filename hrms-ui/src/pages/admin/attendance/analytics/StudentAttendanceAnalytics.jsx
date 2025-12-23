import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaChartPie,
  FaCheckCircle,
  FaFilter,
} from "react-icons/fa";

/* ================= HELPERS ================= */

const getStatus = (percentage) => {
  if (percentage >= 85) return "Good";
  if (percentage >= 65) return "Average";
  return "Poor";
};

export default function StudentAnalytics() {
  const [students, setStudents] = useState([]);
  const [attendanceStore, setAttendanceStore] = useState({});
  const [batches, setBatches] = useState([]);

  /* FILTER STATE */
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All");
  const [batch, setBatch] = useState("All");
  const [year, setYear] = useState("All");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    setStudents(users.students || []);

    setAttendanceStore(
      JSON.parse(localStorage.getItem("attendance")) || {}
    );

    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
  }, []);

  const getBatchName = (id) =>
    batches.find((b) => String(b.id) === String(id))?.name || "—";

  /* ================= PROCESS ATTENDANCE ================= */
  const processedData = useMemo(() => {
    return students
      .map((student) => {
        let present = 0;
        let totalDays = 0;

        Object.values(attendanceStore).forEach((dayObj) => {
          const batchAttendance = dayObj?.[student.batchId];
          if (batchAttendance && batchAttendance[student.id]) {
            totalDays++;
            if (batchAttendance[student.id] === "Present") {
              present++;
            }
          }
        });

        const absent = totalDays - present;
        const percentage =
          totalDays > 0
            ? Math.round((present / totalDays) * 100)
            : 0;

        return {
          ...student,
          batch: getBatchName(student.batchId),
          totalDays,
          present,
          absent,
          percentage,
          status: getStatus(percentage),
        };
      })
      .filter((s) => {
        return (
          s.name.toLowerCase().includes(search.toLowerCase()) &&
          (course === "All" || s.course === course) &&
          (batch === "All" || s.batch === batch) &&
          (year === "All" || s.year === year)
        );
      });
  }, [students, attendanceStore, search, course, batch, year]);

  /* ================= FILTER OPTIONS ================= */
  const courses = ["All", ...new Set(students.map((s) => s.course))];
  const batchesList = ["All", ...new Set(processedData.map((s) => s.batch))];
  const years = ["All", ...new Set(students.map((s) => s.year))];

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const totalStudents = processedData.length;
    const avgAttendance =
      processedData.reduce((acc, s) => acc + s.percentage, 0) /
      (totalStudents || 1);

    return {
      totalStudents,
      avgAttendance: Math.round(avgAttendance),
      regularStudents: processedData.filter(
        (s) => s.status === "Good"
      ).length,
    };
  }, [processedData]);

  return (
    <div className="p-6 space-y-6 text-gray-800">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Student Attendance Analytics
        </h1>

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/60 border"
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white/40 p-4 rounded-2xl shadow">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-purple-600" />
          <span className="font-semibold">Filters</span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Select label="Course" value={course} onChange={setCourse} options={courses} />
          <Select label="Batch" value={batch} onChange={setBatch} options={batchesList} />
          <Select label="Year" value={year} onChange={setYear} options={years} />

          <button
            onClick={() => {
              setSearch("");
              setCourse("All");
              setBatch("All");
              setYear("All");
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white"
          >
            Reset
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard icon={<FaUsers />} label="Total Students" value={summary.totalStudents} />
        <SummaryCard icon={<FaChartPie />} label="Avg Attendance" value={`${summary.avgAttendance}%`} />
        <SummaryCard icon={<FaCheckCircle />} label="Regular Students" value={summary.regularStudents} />
      </div>

      {/* TABLE */}
      <div className="bg-white/40 rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Present</th>
              <th className="px-4 py-3">Absent</th>
              <th className="px-4 py-3">%</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {processedData.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-center">{s.course}</td>
                <td className="px-4 py-3 text-center">{s.batch}</td>
                <td className="px-4 py-3 text-center">{s.year}</td>
                <td className="px-4 py-3 text-center text-green-700">{s.present}</td>
                <td className="px-4 py-3 text-center text-red-600">{s.absent}</td>
                <td className="px-4 py-3 text-center font-semibold">{s.percentage}%</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={s.status} />
                </td>
              </tr>
            ))}

            {processedData.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No attendance data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-white/60"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="bg-white/40 p-5 rounded-2xl shadow">
      <div className="flex items-center gap-3 text-purple-600">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === "Good"
          ? "bg-green-200 text-green-800"
          : status === "Average"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-red-200 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}
