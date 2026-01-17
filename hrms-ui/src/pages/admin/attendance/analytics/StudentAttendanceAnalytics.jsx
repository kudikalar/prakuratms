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

const getCourseNameFromBatch = (batchId, batches, courses) => {
  const batch = batches.find((b) => String(b.id) === String(batchId));
  if (!batch) return "—";

  if (batch.courseId) {
    return (
      courses.find((c) => String(c.id) === String(batch.courseId))
        ?.title || "—"
    );
  }

  if (typeof batch.course === "string") return batch.course;
  if (batch.course?.title) return batch.course.title;

  return "—";
};

const getYearFromStudentOrBatch = (student, batch) => {
  if (student.year) return student.year;
  if (batch?.startDate) return new Date(batch.startDate).getFullYear();
  return "—";
};

/* ================= COMPONENT ================= */

export default function StudentAnalytics() {
  const [students, setStudents] = useState([]);
  const [attendanceStore, setAttendanceStore] = useState({});
  const [batches, setBatches] = useState([]);
  const [coursesMaster, setCoursesMaster] = useState([]);

  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All");
  const [batch, setBatch] = useState("All");
  const [year, setYear] = useState("All");

  /* ================= LOAD ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    setStudents(users.students || []);
    setAttendanceStore(JSON.parse(localStorage.getItem("attendance")) || {});
    setBatches(JSON.parse(localStorage.getItem("batches")) || []);
    setCoursesMaster(JSON.parse(localStorage.getItem("courses")) || []);
  }, []);

  /* ================= PROCESS ================= */
  const processedData = useMemo(() => {
    return students
      .map((student) => {
        let present = 0;
        let totalDays = 0;

        Object.values(attendanceStore).forEach((dayObj) => {
          const batchAttendance = dayObj?.[student.batchId];
          if (batchAttendance && batchAttendance[student.id]) {
            totalDays++;
            if (batchAttendance[student.id] === "Present") present++;
          }
        });

        const batchObj = batches.find(
          (b) => String(b.id) === String(student.batchId)
        );

        const percentage =
          totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

        return {
          ...student,
          batch: batchObj?.name || "—",
          course: getCourseNameFromBatch(
            student.batchId,
            batches,
            coursesMaster
          ),
          year: getYearFromStudentOrBatch(student, batchObj),
          present,
          absent: totalDays - present,
          totalDays,
          percentage,
          status: getStatus(percentage),
        };
      })
      .filter((s) => {
        return (
          s.name.toLowerCase().includes(search.toLowerCase()) &&
          (course === "All" || s.course === course) &&
          (batch === "All" || s.batch === batch) &&
          (year === "All" || String(s.year) === String(year))
        );
      });
  }, [
    students,
    attendanceStore,
    batches,
    coursesMaster,
    search,
    course,
    batch,
    year,
  ]);

  /* ================= OPTIONS ================= */
  const courseOptions = useMemo(
    () => ["All", ...new Set(processedData.map((s) => s.course))],
    [processedData]
  );
  const batchOptions = useMemo(
    () => ["All", ...new Set(processedData.map((s) => s.batch))],
    [processedData]
  );
  const yearOptions = useMemo(
    () => ["All", ...new Set(processedData.map((s) => s.year))],
    [processedData]
  );

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const totalStudents = processedData.length;
    const avgAttendance =
      processedData.reduce((acc, s) => acc + s.percentage, 0) /
      (totalStudents || 1);

    return {
      totalStudents,
      avgAttendance: Math.round(avgAttendance),
      regularStudents: processedData.filter((s) => s.status === "Good").length,
    };
  }, [processedData]);

  return (
    <div className="dashboard-content relative max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      
      {/* 🌈 Ambient glass glow (ADD-ONLY) */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

      {/* HEADER */}
      <div className="glass-panel relative z-10">
        <h1 className="text-2xl font-semibold">
          Student Attendance Analytics
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Course, batch & year-wise attendance insights
        </p>

        <input
          className="glass-input mt-6 max-w-sm"
          placeholder="Search student…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="glass-card relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-violet-600" />
          <span className="font-semibold">Filters</span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select label="Course" value={course} onChange={setCourse} options={courseOptions} />
          <Select label="Batch" value={batch} onChange={setBatch} options={batchOptions} />
          <Select label="Year" value={year} onChange={setYear} options={yearOptions} />

          <button
            onClick={() => {
              setSearch("");
              setCourse("All");
              setBatch("All");
              setYear("All");
            }}
            className="btn-primary"
          >
            Reset
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
        <SummaryCard icon={<FaUsers />} label="Total Students" value={summary.totalStudents} />
        <SummaryCard icon={<FaChartPie />} label="Avg Attendance" value={`${summary.avgAttendance}%`} />
        <SummaryCard icon={<FaCheckCircle />} label="Regular Students" value={summary.regularStudents} />
      </div>

      {/* TABLE */}
      <div className="glass-card relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="border-b text-slate-600">
              <tr>
                <th className="text-left py-3">Student</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Year</th>
                <th>Present</th>
                <th>Absent</th>
                <th>%</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {processedData.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-violet-50/40 transition"
                >
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="text-center">{s.course}</td>
                  <td className="text-center">{s.batch}</td>
                  <td className="text-center">{s.year}</td>
                  <td className="text-center text-emerald-600">{s.present}</td>
                  <td className="text-center text-rose-600">{s.absent}</td>
                  <td className="text-center font-semibold">{s.percentage}%</td>
                  <td className="text-center">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}

              {processedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-500">
                    No attendance data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <select
        className="glass-input mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
    <div className="glass-kpi glass-hover">
      <div className="flex items-center gap-3 text-violet-600">
        {icon}
        <span className="text-sm text-slate-600">{label}</span>
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
          ? "bg-emerald-100 text-emerald-700"
          : status === "Average"
          ? "bg-amber-100 text-amber-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {status}
    </span>
  );
}
