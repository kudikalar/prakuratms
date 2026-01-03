import { useEffect, useState, useMemo } from "react";
import {
  FaBookOpen,
  FaUserTie,
  FaClock,
  FaPlayCircle,
  FaSearch,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

/* ================= STORAGE KEYS ================= */
const USERS_KEY = "users";
const COURSES_KEY = "PRAKURA_COURSES";
const BATCHES_KEY = "batches";

/* ================= STATUS STYLES ================= */

const STATUS_STYLES = {
  COMPLETED: {
    card: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    progress: "bg-emerald-500",
  },
  ONGOING: {
    card: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    progress: "bg-indigo-500",
  },
  NOT_STARTED: {
    card: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    progress: "bg-slate-400",
  },
};

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ================= LOAD COURSES LOGIN-WISE ================= */
useEffect(() => {
  const loadStudentCourses = () => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser || loggedUser.role !== "STUDENT") {
      setCourses([]);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || { students: [] };
    const coursesLS = JSON.parse(localStorage.getItem("PRAKURA_COURSES")) || [];
    const batches = JSON.parse(localStorage.getItem("batches")) || [];

    const student = users.students.find(
      (s) => s.email?.toLowerCase() === loggedUser.email?.toLowerCase()
    );

    if (!student) {
      setCourses([]);
      return;
    }

    const batch = batches.find(
      (b) => String(b.id) === String(student.batchId)
    );

    const course = coursesLS.find(
      (c) => String(c._id) === String(student.courseId)
    );

    if (!course) {
      setCourses([]);
      return;
    }

    setCourses([
      {
        id: course._id,
        title: course.title,
        trainer: course.trainer || "Assigned Trainer",
        duration: course.duration || "—",
        progress: 0,
        lastAccessed: "Not started",
        nextSession: batch
          ? `${batch.startDate} → ${batch.endDate}`
          : "Upcoming",
        skills: course.skills || [],
        resumeWeight: "High",
      },
    ]);
  };

  loadStudentCourses();

  // 🔥 Re-load when admin updates data
  window.addEventListener("storage", loadStudentCourses);
  return () => window.removeEventListener("storage", loadStudentCourses);
}, []);


  /* ================= FILTER ================= */

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
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-white/70 p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              My Courses
            </h2>
            <p className="text-sm text-slate-500">
              Courses assigned to you
            </p>
          </div>

          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-2 rounded-xl border w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {["ALL", "ONGOING", "COMPLETED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold
                ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* COURSES */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {!filteredCourses.length && (
        <p className="text-center text-slate-400 py-10">
          No courses assigned yet
        </p>
      )}
    </div>
  );
}

/* ================= COURSE CARD ================= */

const CourseCard = ({ course }) => {
  const status =
    course.progress === 100
      ? "COMPLETED"
      : course.progress > 0
      ? "ONGOING"
      : "NOT_STARTED";

  const styles = STATUS_STYLES[status];

  return (
    <div className={`rounded-2xl p-6 border shadow ${styles.card}`}>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FaBookOpen className="text-indigo-600" />
          {course.title}
        </h3>

        {status === "COMPLETED" && (
          <span className={`text-xs px-3 py-1 rounded-full ${styles.badge}`}>
            <FaCheckCircle className="inline mr-1" /> Completed
          </span>
        )}
      </div>

      <Meta icon={<FaUserTie />} label="Trainer" value={course.trainer} />
      <Meta icon={<FaClock />} label="Duration" value={course.duration} />
      <Meta
        icon={<FaCalendarAlt />}
        label="Batch"
        value={course.nextSession}
      />

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className={`h-full rounded-full ${styles.progress}`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      <button className="mt-5 w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold">
        <FaPlayCircle className="inline mr-2" />
        Start Learning
      </button>
    </div>
  );
};

const Meta = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
    <span className="text-indigo-500">{icon}</span>
    <span>{label}:</span>
    <span>{value}</span>
  </div>
);
