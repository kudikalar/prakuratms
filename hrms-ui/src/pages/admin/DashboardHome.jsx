import { useState } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowUp,
  FaUsersCog,
  FaTimes,
  FaSearch,
  FaBell,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= MOCK DATA ================= */

const enrollmentData = [
  {
    month: "Jan",
    total: 120,
    courses: [
      { name: "Full Stack", value: 45, students: ["Anita", "Ramesh", "Karthik", "Divya"] },
      { name: "Data Science", value: 35, students: ["Suresh", "Meena", "Rahul"] },
      { name: "Python", value: 40, students: ["Arjun", "Priya", "Vikram"] },
    ],
  },
  {
    month: "Feb",
    total: 180,
    courses: [
      { name: "Full Stack", value: 70, students: ["Naveen", "Anita", "Ramesh"] },
      { name: "Data Science", value: 55, students: ["Meena", "Rahul", "Kiran"] },
      { name: "Python", value: 55, students: ["Arjun", "Priya", "Vikram"] },
    ],
  },
];

/* ================= DASHBOARD ================= */

export default function DashboardHome() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-200
        via-slate-300/80
        to-slate-400/60
        backdrop-blur-xl
        p-6
        space-y-8
      "
    >


      {/* ================= HEADER ================= */}
      <div className="glass-panel px-6 py-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          Dashboard Overview
        </h2>
        <p className="text-slate-600">
          System statistics & administrative insights
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat title="Total Students" value="1,248" percent="80%" />
        <Stat title="Educators" value="64" percent="60%" />
        <Stat title="Courses" value="132" percent="70%" />
        <Stat title="Departments" value="12" percent="40%" />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 glass-hover">
          <h3 className="font-semibold text-slate-700 mb-4">
            Student Enrollment Growth
          </h3>

          <ResponsiveContainer width="100%" height={260}>
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

          <p className="text-xs text-slate-500 mt-2">
            Click a month to drill down
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center glass-hover">
          <h3 className="font-semibold text-slate-700 mb-4">
            System Completion
          </h3>
          <div className="w-36 h-36 rounded-full border-[10px] border-purple-300 flex items-center justify-center bg-white/40 backdrop-blur">
            <span className="text-2xl font-bold text-slate-800">82%</span>
          </div>
        </GlassCard>
      </div>

      {/* ================= COURSE DRILL DOWN ================= */}
      {selectedMonth && (
        <GlassCard className="glass-hover">
          <div className="flex justify-between items-center mb-4">
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

          <ResponsiveContainer width="100%" height={220}>
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
            Recently Added Users
          </h3>
          {["Anita", "Ramesh", "Karthik", "Divya"].map((u) => (
            <div key={u} className="flex justify-between text-sm mb-3">
              <span className="text-slate-600">{u}</span>
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
          <Detail icon={<FaUserGraduate />} label="Students" value="1,248" />
          <Detail icon={<FaChalkboardTeacher />} label="Educators" value="64" />
          <Detail icon={<FaUsersCog />} label="Admins" value="5" />
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
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative glass-card w-[420px]">
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
    <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>

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
