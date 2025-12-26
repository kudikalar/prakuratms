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
  const batch = batches.find(b => String(b.id) === String(batchId));
  if (!batch) return "—";

  if (batch.courseId) {
    return (
      courses.find(c => String(c.id) === String(batch.courseId))?.title || "—"
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
    setCoursesMaster(JSON.parse(localStorage.getItem("courses")) || []);
  }, []);

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
            if (batchAttendance[student.id] === "Present") present++;
          }
        });

        const absent = totalDays - present;
        const percentage =
          totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

        const batchObj = batches.find(
          (b) => String(b.id) === String(student.batchId)
        );

        const derivedCourse = getCourseNameFromBatch(
          student.batchId,
          batches,
          coursesMaster
        );

        const derivedYear = getYearFromStudentOrBatch(
          student,
          batchObj
        );

        return {
          ...student,
          batch: batchObj?.name || "—",
          course: derivedCourse,
          year: derivedYear,
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

  /* ================= FILTER OPTIONS ================= */
  const courseOptions = useMemo(
    () => ["All", ...new Set(processedData.map(s => s.course).filter(Boolean))],
    [processedData]
  );

  const batchOptions = useMemo(
    () => ["All", ...new Set(processedData.map(s => s.batch).filter(Boolean))],
    [processedData]
  );

  const yearOptions = useMemo(
    () => ["All", ...new Set(processedData.map(s => s.year).filter(Boolean))],
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
      regularStudents: processedData.filter(
        (s) => s.status === "Good"
      ).length,
    };
  }, [processedData]);

  return (
    <div
      className="
        max-w-7xl mx-auto space-y-8 pb-24 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Student Attendance Analytics
          </h1>
          <p className="text-sm text-slate-600">
            Course • Batch • Year wise attendance insights
          </p>
        </div>

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input w-full md:w-72"
        />
      </div>

      {/* FILTERS */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-purple-600" />
          <span className="font-semibold text-slate-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
            className="
              px-4 py-2 rounded-xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white font-semibold
              hover:from-purple-700 hover:to-indigo-700
            "
          >
            Reset
          </button>
        </div>
      </GlassCard>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard icon={<FaUsers />} label="Total Students" value={summary.totalStudents} />
        <SummaryCard icon={<FaChartPie />} label="Avg Attendance" value={`${summary.avgAttendance}%`} />
        <SummaryCard icon={<FaCheckCircle />} label="Regular Students" value={summary.regularStudents} />
      </div>

      {/* TABLE */}
      <GlassCard>
        <table className="w-full text-sm">
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
              <tr key={s.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{s.name}</td>
                <td className="text-center">{s.course}</td>
                <td className="text-center">{s.batch}</td>
                <td className="text-center">{s.year}</td>
                <td className="text-center text-green-700">{s.present}</td>
                <td className="text-center text-red-600">{s.absent}</td>
                <td className="text-center font-semibold">{s.percentage}%</td>
                <td className="text-center">
                  <StatusBadge status={s.status} />
                </td>
              </tr>
            ))}

            {processedData.length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-500">
                  No attendance data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

/* ================= UI ================= */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-input mt-1"
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
    <GlassCard>
      <div className="flex items-center gap-3 text-purple-600">
        {icon}
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </GlassCard>
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

function GlassCard({ children }) {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow">
      {children}
    </div>
  );
}
