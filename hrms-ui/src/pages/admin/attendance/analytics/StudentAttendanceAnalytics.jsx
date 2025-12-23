import { useState, useMemo } from "react";
import {
  FaUsers,
  FaChartPie,
  FaCheckCircle,
  FaFilter,
} from "react-icons/fa";

/* ---------------- MOCK DATA (API READY) ---------------- */
const studentsData = [
  {
    id: 1,
    name: "Arjun Kumar",
    course: "Full Stack",
    batch: "B1",
    year: 2024,
    totalDays: 60,
    present: 52,
    absent: 8,
  },
  {
    id: 2,
    name: "Priya Sharma",
    course: "Java",
    batch: "B2",
    year: 2024,
    totalDays: 60,
    present: 44,
    absent: 16,
  },
  {
    id: 3,
    name: "Rahul Verma",
    course: "Python",
    batch: "B1",
    year: 2023,
    totalDays: 60,
    present: 35,
    absent: 25,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    course: "Full Stack",
    batch: "B2",
    year: 2023,
    totalDays: 60,
    present: 56,
    absent: 4,
  },
];

/* ---------------- HELPERS ---------------- */
const getStatus = (percentage) => {
  if (percentage >= 85) return "Good";
  if (percentage >= 65) return "Average";
  return "Poor";
};

export default function StudentAnalytics() {
  /* ---------------- SEARCH & FILTER STATES ---------------- */
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All");
  const [batch, setBatch] = useState("All");
  const [year, setYear] = useState("All");

  /* ---------------- FILTER OPTIONS ---------------- */
  const courses = ["All", ...new Set(studentsData.map((s) => s.course))];
  const batches = ["All", ...new Set(studentsData.map((s) => s.batch))];
  const years = ["All", ...new Set(studentsData.map((s) => s.year))];

  /* ---------------- FILTER + PROCESS DATA ---------------- */
  const processedData = useMemo(() => {
    return studentsData
      .filter((s) => {
        return (
          s.name.toLowerCase().includes(search.toLowerCase()) &&
          (course === "All" || s.course === course) &&
          (batch === "All" || s.batch === batch) &&
          (year === "All" || s.year === year)
        );
      })
      .map((s) => {
        const percentage = Math.round(
          (s.present / s.totalDays) * 100
        );
        return { ...s, percentage, status: getStatus(percentage) };
      });
  }, [search, course, batch, year]);

  /* ---------------- SUMMARY ---------------- */
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
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-wide">
          Student Attendance Analytics
        </h1>

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur border outline-none"
        />
      </div>

     {/* FILTERS */}
<div className="bg-white/40 backdrop-blur-xl p-4 rounded-2xl shadow">
  <div className="flex items-center gap-3 mb-4">
    <FaFilter className="text-purple-600" />
    <span className="font-semibold">Filters</span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* COURSE */}
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">
        Course
      </label>
      <select
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        className="px-3 py-2 rounded-xl bg-white/60 outline-none"
      >
        {courses.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* BATCH */}
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">
        Batch
      </label>
      <select
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
        className="px-3 py-2 rounded-xl bg-white/60 outline-none"
      >
        {batches.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>
    </div>

    {/* YEAR */}
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">
        Year
      </label>
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value) || "All")}
        className="px-3 py-2 rounded-xl bg-white/60 outline-none"
      >
        {years.map((y) => (
          <option key={y}>{y}</option>
        ))}
      </select>
    </div>

    {/* RESET */}
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-transparent">
        Reset
      </label>
      <button
        onClick={() => {
          setSearch("");
          setCourse("All");
          setBatch("All");
          setYear("All");
        }}
        className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
      >
        Reset Filters
      </button>
    </div>
  </div>
</div>


      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<FaUsers />}
          label="Total Students"
          value={summary.totalStudents}
          color="purple"
        />
        <SummaryCard
          icon={<FaChartPie />}
          label="Average Attendance"
          value={`${summary.avgAttendance}%`}
          color="green"
        />
        <SummaryCard
          icon={<FaCheckCircle />}
          label="Regular Students"
          value={summary.regularStudents}
          color="blue"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow overflow-hidden">
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
              <tr
                key={s.id}
                className="border-t border-white/30 hover:bg-white/30"
              >
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-center">{s.course}</td>
                <td className="px-4 py-3 text-center">{s.batch}</td>
                <td className="px-4 py-3 text-center">{s.year}</td>
                <td className="px-4 py-3 text-center text-green-700">{s.present}</td>
                <td className="px-4 py-3 text-center text-red-600">{s.absent}</td>
                <td className="px-4 py-3 text-center font-semibold">{s.percentage}%</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        s.status === "Good"
                          ? "bg-green-200 text-green-800"
                          : s.status === "Average"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }
                    `}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}

            {processedData.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No data found for selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE CARD ---------------- */
function SummaryCard({ icon, label, value, color }) {
  return (
    <div className="bg-white/40 backdrop-blur-xl p-5 rounded-2xl shadow">
      <div className={`flex items-center gap-3 text-${color}-600`}>
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
