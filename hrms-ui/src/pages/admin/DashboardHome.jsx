import { useEffect, useMemo, useState } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowUp,
  FaUsersCog,
  FaTimes,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= HELPERS ================= */

const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || {
    students: [],
    educators: [],
    admins: [],
  };

const getCourses = () =>
  JSON.parse(localStorage.getItem("courses")) || [];

/* ================= DASHBOARD ================= */

export default function DashboardHome() {
  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  /* ================= LOAD REAL DATA ================= */
  useEffect(() => {
    const users = getUsers();
    setStudents(users.students || []);
    setEducators(users.educators || []);
    setAdmins(users.admins || []);
    setCourses(getCourses());
  }, []);

  /* ================= ENROLLMENT BY MONTH ================= */
  const enrollmentData = useMemo(() => {
    const map = {};

    students.forEach((s) => {
      const date = s.createdAt
        ? new Date(s.createdAt)
        : new Date();

      const month = date.toLocaleString("default", {
        month: "short",
      });

      if (!map[month]) {
        map[month] = {
          month,
          total: 0,
          courses: {},
        };
      }

      map[month].total += 1;

      const course = s.course || "General";

      if (!map[month].courses[course]) {
        map[month].courses[course] = {
          name: course,
          value: 0,
          students: [],
        };
      }

      map[month].courses[course].value += 1;
      map[month].courses[course].students.push(s.name);
    });

    return Object.values(map).map((m) => ({
      ...m,
      courses: Object.values(m.courses),
    }));
  }, [students]);

  /* ================= RECENT USERS ================= */
  const recentStudents = useMemo(() => {
    return [...students]
      .sort(
        (a, b) =>
          new Date(b.createdAt || Date.now()) -
          new Date(a.createdAt || Date.now())
      )
      .slice(0, 4);
  }, [students]);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-200
        via-slate-300/80
        to-slate-400/60
        backdrop-blur-xl
        p-4 sm:p-6 lg:p-8
        space-y-8
      "
    >
      {/* ================= HEADER ================= */}
      <div className="glass-panel px-4 sm:px-6 py-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
          Dashboard Overview
        </h2>
        <p className="text-sm text-slate-600">
          Live system statistics & administrative insights
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Total Students" value={students.length} percent="80%" />
        <Stat title="Educators" value={educators.length} percent="60%" />
        <Stat title="Courses" value={courses.length} percent="70%" />
        <Stat title="Admins" value={admins.length} percent="40%" />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 glass-hover">
          <h3 className="font-semibold text-slate-700 mb-4">
            Student Enrollment Growth
          </h3>

          <div className="w-full h-[240px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enrollmentData}
                onClick={(e) => {
                  if (e?.activePayload?.[0]?.payload) {
                    setSelectedMonth(e.activePayload[0].payload);
                  }
                }}
              >
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="total" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Click a month to drill down
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center glass-hover">
          <h3 className="font-semibold text-slate-700 mb-4">
            System Completion
          </h3>
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-[10px] border-purple-300 flex items-center justify-center bg-white/40 backdrop-blur">
            <span className="text-xl sm:text-2xl font-bold text-slate-800">
              {students.length > 0 ? "100%" : "0%"}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* ================= COURSE DRILL DOWN ================= */}
      {selectedMonth && (
        <GlassCard className="glass-hover">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h4 className="font-semibold text-slate-800">
              {selectedMonth.month} – Course-wise Enrollment
            </h4>
            <button
              onClick={() => setSelectedMonth(null)}
              className="text-sm text-purple-600 hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedMonth.courses}
                onClick={(e) => {
                  if (e?.activePayload?.[0]?.payload) {
                    setSelectedCourse(e.activePayload[0].payload);
                  }
                }}
              >
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* ================= STUDENT MODAL ================= */}
      {selectedCourse && (
        <StudentModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {/* ================= LOWER PANELS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="font-semibold text-slate-700 mb-4">
            Recently Added Students
          </h3>
          {recentStudents.map((u) => (
            <div key={u.id} className="flex justify-between text-sm mb-3">
              <span className="text-slate-600">{u.name}</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <FaArrowUp /> Active
              </span>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-700 mb-4">
            User Distribution
          </h3>
          <Detail icon={<FaUserGraduate />} label="Students" value={students.length} />
          <Detail icon={<FaChalkboardTeacher />} label="Educators" value={educators.length} />
          <Detail icon={<FaUsersCog />} label="Admins" value={admins.length} />
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-700 mb-4">
            Access Platforms
          </h3>
          <Platform label="Web Portal" value="61%" />
          <Platform label="Mobile App" value="29%" />
          <Platform label="Tablet / Others" value="10%" />
        </GlassCard>
      </div>
    </div>
  );
}

/* ================= STUDENT MODAL ================= */

const StudentModal = ({ course, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative glass-card w-full max-w-md sm:max-w-[420px]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-500 hover:text-red-500"
      >
        <FaTimes />
      </button>

      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        {course.name} – Students
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {course.students.map((s) => (
          <div
            key={s}
            className="flex justify-between px-3 py-2 rounded-lg bg-white/40 hover:bg-white/60 transition"
          >
            <span className="text-slate-700">{s}</span>
            <span className="text-xs text-emerald-500 font-medium">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ================= UI HELPERS ================= */

const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-card ${className}`}>{children}</div>
);

const Stat = ({ title, value, percent }) => (
  <GlassCard className="glass-hover">
    <p className="text-sm text-slate-600">{title}</p>
    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
      {value}
    </h3>

    <div className="h-2 mt-3 rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-purple-500"
        style={{ width: percent }}
      />
    </div>
  </GlassCard>
);

const Detail = ({ icon, label, value }) => (
  <div className="flex justify-between items-center text-sm mb-3">
    <div className="flex items-center gap-2 text-slate-600">
      {icon}
      {label}
    </div>
    <span className="font-semibold text-slate-800">{value}</span>
  </div>
);

const Platform = ({ label, value }) => (
  <div className="flex justify-between text-sm mb-3 text-slate-600">
    <span>{label}</span>
    <span className="font-semibold text-slate-800">{value}</span>
  </div>
);
