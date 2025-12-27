import { useEffect, useState, useMemo } from "react";
import {
  FaBookOpen,
  FaUserTie,
  FaClock,
  FaPlayCircle,
  FaSearch,
  FaCheckCircle,
  FaCalendarAlt,
  FaCertificate,
  FaChartLine,
} from "react-icons/fa";

/* =========================================================
   STUDENT - MY COURSES (ENTERPRISE | PRODUCTION READY)
========================================================= */

/* ================= STATUS STYLES ================= */

const STATUS_STYLES = {
  COMPLETED: {
    card:
      "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-emerald-200/60",
    badge: "bg-emerald-100 text-emerald-700",
    progress: "bg-emerald-500",
    glow: "hover:shadow-emerald-300/50",
  },
  ONGOING: {
    card:
      "bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border-indigo-200/60",
    badge: "bg-indigo-100 text-indigo-700",
    progress: "bg-indigo-500",
    glow: "hover:shadow-indigo-300/50",
  },
  NOT_STARTED: {
    card:
      "bg-gradient-to-br from-slate-50/80 to-gray-50/80 border-slate-200/60",
    badge: "bg-slate-100 text-slate-700",
    progress: "bg-slate-400",
    glow: "hover:shadow-slate-300/40",
  },
};

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ================= INIT ================= */

  useEffect(() => {
    setCourses([
      {
        id: 1,
        title: "Full Stack Development",
        trainer: "Ramesh K",
        duration: "6 Months",
        progress: 72,
        lastAccessed: "2 days ago",
        nextSession: "Tomorrow 6:00 PM",
        skills: ["React", "Node.js", "MongoDB"],
        resumeWeight: "High",
      },
      {
        id: 2,
        title: "Automation Testing (Playwright)",
        trainer: "Suresh M",
        duration: "2 Months",
        progress: 45,
        lastAccessed: "5 days ago",
        nextSession: "Friday 7:00 PM",
        skills: ["Playwright", "JavaScript", "CI/CD"],
        resumeWeight: "Medium",
      },
      {
        id: 3,
        title: "Manual Testing",
        trainer: "Anitha S",
        duration: "1 Month",
        progress: 100,
        lastAccessed: "Completed",
        nextSession: null,
        skills: ["STLC", "Test Cases", "Bug Tracking"],
        resumeWeight: "Medium",
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.trainer.toLowerCase().includes(search.toLowerCase());

      const status =
        course.progress === 100
          ? "COMPLETED"
          : course.progress > 0
          ? "ONGOING"
          : "NOT_STARTED";

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              My Courses
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track learning, live sessions & certifications
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course or trainer..."
              className="w-full pl-11 pr-4 py-2 rounded-xl border bg-white/80"
            />
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {["ALL", "ONGOING", "COMPLETED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {s === "ALL" ? "All" : s === "ONGOING" ? "Ongoing" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {!filteredCourses.length && (
        <p className="text-center text-slate-400 text-sm py-10">
          No courses found
        </p>
      )}
    </div>
  );
}

/* =========================================================
   COURSE CARD
========================================================= */

const CourseCard = ({ course }) => {
  const status =
    course.progress === 100
      ? "COMPLETED"
      : course.progress > 0
      ? "ONGOING"
      : "NOT_STARTED";

  const styles = STATUS_STYLES[status];

  return (
    <div
      className={`
        group relative
        backdrop-blur-xl
        rounded-2xl p-6
        border
        shadow-lg shadow-black/5
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        ${styles.card}
        ${styles.glow}
      `}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FaBookOpen className="text-indigo-600" />
          {course.title}
        </h3>

        {status === "COMPLETED" && (
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${styles.badge}`}
          >
            <FaCheckCircle /> Completed
          </span>
        )}
      </div>

      {/* META */}
      <Meta icon={<FaUserTie />} label="Trainer" value={course.trainer} />
      <Meta icon={<FaClock />} label="Duration" value={course.duration} />
      <Meta
        icon={<FaCalendarAlt />}
        label="Last Accessed"
        value={course.lastAccessed}
      />

      {course.nextSession && (
        <Meta
          icon={<FaCalendarAlt />}
          label="Next Live Session"
          value={course.nextSession}
          highlight
        />
      )}

      {/* SKILLS */}
      <div className="flex flex-wrap gap-2 mt-3">
        {course.skills.map((skill) => (
          <span
            key={skill}
            className="
              text-xs px-3 py-1 rounded-full
              bg-white/70 backdrop-blur
              border border-white/60
              text-slate-700 shadow-sm
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 text-slate-600">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${styles.progress}`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      {/* RESUME WEIGHT */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
        <FaChartLine />
        Resume Impact:{" "}
        <span className="font-semibold">{course.resumeWeight}</span>
      </div>

      {/* ACTIONS */}
      <div className="mt-5 space-y-2">
        <button
          className="
            w-full flex items-center justify-center gap-2
            py-2 rounded-xl
            bg-gradient-to-r from-indigo-600 to-blue-600
            hover:from-indigo-700 hover:to-blue-700
            text-white text-sm font-semibold
            shadow-md hover:shadow-lg
          "
        >
          <FaPlayCircle />
          {status === "COMPLETED"
            ? "Review Course"
            : status === "ONGOING"
            ? "Continue Learning"
            : "Start Course"}
        </button>

        {status === "COMPLETED" && (
          <button
            className="
              w-full flex items-center justify-center gap-2
              py-2 rounded-xl
              border text-sm font-semibold
              bg-white/70 backdrop-blur
              hover:bg-white/90
            "
          >
            <FaCertificate />
            Download Certificate
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   SMALL COMPONENT
========================================================= */

const Meta = ({ icon, label, value, highlight }) => (
  <div
    className={`flex items-center gap-3 text-sm mb-1 ${
      highlight ? "text-indigo-600 font-semibold" : "text-slate-600"
    }`}
  >
    <span className="text-indigo-500">{icon}</span>
    <span>{label}:</span>
    <span>{value}</span>
  </div>
);
