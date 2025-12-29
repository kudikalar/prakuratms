import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
} from "react-icons/fa";

/* ================= MOCK DATA (Replace with API later) ================= */
const MOCK_ASSIGNED_COURSES = [
  {
    id: 1,
    title: "Full Stack Development",
    category: "Development",
    progress: 65,
    duration: "12 Weeks",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Manual Testing Fundamentals",
    category: "Testing",
    progress: 100,
    duration: "6 Weeks",
    status: "Completed",
  },
  {
    id: 3,
    title: "Playwright Automation",
    category: "Automation",
    progress: 0,
    duration: "4 Weeks",
    status: "Not Started",
  },
];

/* ================= STATUS STYLES ================= */
const statusStyles = {
  "Not Started": "bg-gray-200 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

export default function AssignedCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Replace with API call
    setCourses(MOCK_ASSIGNED_COURSES);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Assigned Courses
        </h1>
        <p className="text-sm text-gray-500">
          Courses assigned to you with progress tracking
        </p>
      </div>

      {/* ================= COURSE LIST ================= */}
      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= COURSE CARD ================= */
function CourseCard({ course }) {
  return (
    <div
      className="
        rounded-2xl p-5
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow-lg
        hover:shadow-xl transition
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg text-gray-800">
            {course.title}
          </h2>
          <p className="text-xs text-gray-500">
            {course.category}
          </p>
        </div>

        <span
          className={`
            text-xs px-3 py-1 rounded-full font-medium
            ${statusStyles[course.status]}
          `}
        >
          {course.status}
        </span>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-400" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBookOpen className="text-gray-400" />
          <span>{course.progress}% Completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      {/* Action */}
      <button
        className="
          mt-5 w-full flex items-center justify-center gap-2
          px-4 py-2 rounded-xl
          bg-indigo-600 hover:bg-indigo-700
          text-white text-sm font-semibold
          transition
        "
      >
        {course.progress === 100 ? (
          <>
            <FaCheckCircle /> View Course
          </>
        ) : (
          <>
            <FaPlayCircle /> Continue Learning
          </>
        )}
      </button>
    </div>
  );
}

/* ================= EMPTY STATE ================= */
function EmptyState() {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        py-20
        bg-white/60 backdrop-blur-xl
        rounded-2xl border border-white/40
      "
    >
      <FaBookOpen className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">
        No Courses Assigned
      </h3>
      <p className="text-sm text-gray-500">
        Courses assigned to you will appear here
      </p>
    </div>
  );
}
