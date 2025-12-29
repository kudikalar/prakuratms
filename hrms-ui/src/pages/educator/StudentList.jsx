import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaUserGraduate,
  FaChartLine,
  FaCalendarCheck,
  FaUserCircle,
  FaLayerGroup,
  FaBookOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

/* =====================================================
   STUDENT LIST – EDUCATOR (PRODUCTION READY)
===================================================== */

export default function StudentList() {
  const navigate = useNavigate();
  const { batchId } = useParams(); // OPTIONAL now

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  /* ================= LOAD STUDENTS ================= */

  useEffect(() => {
    // ✅ NO redirect if batchId is missing

    // TODO (API)
    // if (batchId)
    //   GET /educator/batches/:batchId/students
    // else
    //   GET /educator/students

    setStudents([
      {
        id: "S001",
        name: "Ravi Kumar",
        email: "ravi@gmail.com",
        status: "Active",
        progress: 72,
        attendance: 88,
        course: "Playwright Automation",
        batchId: "B101",
      },
      {
        id: "S002",
        name: "Sneha Reddy",
        email: "sneha@gmail.com",
        status: "Active",
        progress: 85,
        attendance: 94,
        course: "Playwright Automation",
        batchId: "B101",
      },
      {
        id: "S003",
        name: "Arjun Patel",
        email: "arjun@gmail.com",
        status: "Inactive",
        progress: 40,
        attendance: 55,
        course: "Selenium Java",
        batchId: "B102",
      },
    ]);
  }, [batchId]);

  /* ================= COURSES ================= */

  const courses = useMemo(() => {
    return ["All", ...new Set(students.map((s) => s.course))];
  }, [students]);

  /* ================= FILTERING ================= */

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || s.status === statusFilter;

      const matchesCourse =
        courseFilter === "All" || s.course === courseFilter;

      const matchesBatch =
        !batchId || s.batchId === batchId;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse &&
        matchesBatch
      );
    });
  }, [students, search, statusFilter, courseFilter, batchId]);

  /* ================= KPIs ================= */

  const kpis = useMemo(() => {
    if (!filteredStudents.length)
      return {
        total: 0,
        active: 0,
        avgProgress: 0,
        avgAttendance: 0,
        atRisk: 0,
      };

    return {
      total: filteredStudents.length,
      active: filteredStudents.filter((s) => s.status === "Active").length,
      avgProgress: Math.round(
        filteredStudents.reduce((a, b) => a + b.progress, 0) /
          filteredStudents.length
      ),
      avgAttendance: Math.round(
        filteredStudents.reduce((a, b) => a + b.attendance, 0) /
          filteredStudents.length
      ),
      atRisk: filteredStudents.filter(
        (s) => s.progress < 50 || s.attendance < 60
      ).length,
    };
  }, [filteredStudents]);

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {batchId ? "Batch Students" : "All Students"}
        </h1>
        {batchId && (
          <p className="text-sm text-gray-500">
            Batch ID: <span className="font-semibold">{batchId}</span>
          </p>
        )}
      </div>

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Kpi label="Total" value={kpis.total} icon={<FaUserGraduate />} />
        <Kpi label="Active" value={kpis.active} icon={<FaLayerGroup />} />
        <Kpi
          label="Avg Progress"
          value={`${kpis.avgProgress}%`}
          icon={<FaChartLine />}
        />
        <Kpi
          label="Avg Attendance"
          value={`${kpis.avgAttendance}%`}
          icon={<FaCalendarCheck />}
        />
        <Kpi
          label="At Risk"
          value={kpis.atRisk}
          icon={<FaExclamationTriangle />}
          danger
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-1/3">
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl
              bg-white/70 border backdrop-blur
              focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-full lg:w-64 px-4 py-2.5 rounded-xl
            bg-white/70 border backdrop-blur"
        >
          {courses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full lg:w-56 px-4 py-2.5 rounded-xl
            bg-white/70 border backdrop-blur"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl bg-white/70 backdrop-blur border shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-white/80 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-t hover:bg-white/60">
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <FaUserGraduate className="text-indigo-600 mt-1" />
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <FaBookOpen className="inline mr-1 text-indigo-500" />
                  {s.course}
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {s.progress}%
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {s.attendance}%
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/educator/student-progress/${s.id}`)
                    }
                    className="px-3 py-2 rounded-full bg-white border"
                  >
                    <FaChartLine />
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/educator/attendance/history/${s.batchId}`
                      )
                    }
                    className="px-3 py-2 rounded-full bg-white border"
                  >
                    <FaCalendarCheck />
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/educator/notes/${s.id}`)
                    }
                    className="px-3 py-2 rounded-full bg-white border"
                  >
                    <FaUserCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */

function Kpi({ label, value, icon, danger }) {
  return (
    <div
      className={`p-4 rounded-xl bg-white/70 border shadow ${
        danger ? "border-red-300" : ""
      }`}
    >
      <div className="flex gap-3 items-center">
        <div
          className={`p-2 rounded-lg ${
            danger
              ? "bg-red-100 text-red-600"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
