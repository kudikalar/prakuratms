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

/* ================= HELPERS ================= */

const readLS = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const getId = (obj) => String(obj?._id || obj?.id || "");

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

/* ================= COMPONENT ================= */

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ================= LOAD STUDENT COURSES ================= */

  useEffect(() => {
    const loadStudentCourses = () => {
      const loggedUser = readLS("user", null);
      if (!loggedUser || loggedUser.role !== "STUDENT") {
        setCourses([]);
        return;
      }

      const users = readLS(USERS_KEY, { students: [] });
      const allCourses = readLS(COURSES_KEY, []);
      const allBatches = readLS(BATCHES_KEY, []);

      // ✅ Resolve student by ID (single source of truth)
      const student = users.students.find(
        (s) => getId(s) === getId(loggedUser)
      );

      if (!student) {
        setCourses([]);
        return;
      }

      /* ================= RESOLVE COURSE IDS (ROBUST) ================= */

      const courseIds = [
        student.courseId,
        ...(student.courseIds || []),
      ]
        .filter(Boolean)
        .map(String);

      if (!courseIds.length) {
        setCourses([]);
        return;
      }

      /* ================= BUILD COURSE VIEW ================= */

     /* ================= RESOLVE COURSES (ULTIMATE SAFE) ================= */

const resolvedCourses = [];

allCourses.forEach((course) => {
  const courseId = getId(course);
  const courseTitle = course.title?.toLowerCase();

  const matchesDirect =
    String(student.courseId) === courseId ||
    String(student.courseId) === String(course.id) ||
    String(student.courseId)?.toLowerCase() === courseTitle;

  const matchesLegacy =
    String(student.course)?.toLowerCase() === courseTitle ||
    (Array.isArray(student.courses) &&
      student.courses.some(
        (c) => String(c).toLowerCase() === courseTitle
      ));

  let matchesBatch = false;
  if (student.batchId) {
    const batch = allBatches.find(
      (b) => getId(b) === String(student.batchId)
    );
    if (batch) {
      matchesBatch =
        String(batch.courseId) === courseId ||
        String(batch.course)?.toLowerCase() === courseTitle;
    }
  }

  if (matchesDirect || matchesLegacy || matchesBatch) {
    const batch = allBatches.find(
      (b) => getId(b) === String(student.batchId)
    );

    resolvedCourses.push({
      id: courseId,
      title: course.title,
      trainer: course.trainer || "Assigned Trainer",
      duration: course.duration || "—",
      progress: Number(student.progress || 0),
      lastAccessed: student.lastAccessed || "Not started",
      nextSession: batch
        ? `${batch.name} (${batch.startDate || "—"} → ${
            batch.endDate || "—"
          })`
        : "Batch not assigned",
      skills: course.skills || [],
      resumeWeight: "High",
    });
  }
});

setCourses(resolvedCourses);

    };

    loadStudentCourses();
    window.addEventListener("storage", loadStudentCourses);
    return () =>
      window.removeEventListener("storage", loadStudentCourses);
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
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
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
