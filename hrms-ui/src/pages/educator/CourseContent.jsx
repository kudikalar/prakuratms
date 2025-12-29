import { useEffect, useState } from "react";
import {
  FaPlayCircle,
  FaFileAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaLock,
} from "react-icons/fa";

/* ================= MOCK COURSE DATA ================= */
const MOCK_COURSE = {
  title: "Playwright Automation Testing",
  description:
    "Learn end-to-end automation testing using Playwright with real-time projects.",
  modules: [
    {
      id: 1,
      title: "Module 1: Introduction",
      lessons: [
        {
          id: 11,
          title: "What is Playwright?",
          type: "video",
          completed: true,
        },
        {
          id: 12,
          title: "Why Playwright?",
          type: "notes",
          completed: true,
        },
      ],
    },
    {
      id: 2,
      title: "Module 2: Setup & Configuration",
      lessons: [
        {
          id: 21,
          title: "Installing Playwright",
          type: "video",
          completed: false,
        },
        {
          id: 22,
          title: "Project Structure",
          type: "notes",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      title: "Module 3: First Test Script",
      lessons: [
        {
          id: 31,
          title: "Writing First Test",
          type: "video",
          completed: false,
          locked: true,
        },
      ],
    },
  ],
};

export default function CourseContent() {
  const [course, setCourse] = useState(null);
  const [openModule, setOpenModule] = useState(null);

  useEffect(() => {
    // Replace with API call later
    setCourse(MOCK_COURSE);
  }, []);

  if (!course) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div
        className="
          rounded-2xl p-6
          bg-white/70 backdrop-blur-xl
          border border-white/40
          shadow
        "
      >
        <h1 className="text-2xl font-bold text-gray-800">
          {course.title}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {course.description}
        </p>
      </div>

      {/* ================= MODULES ================= */}
      <div className="space-y-4">
        {course.modules.map((module) => (
          <ModuleAccordion
            key={module.id}
            module={module}
            isOpen={openModule === module.id}
            onToggle={() =>
              setOpenModule(
                openModule === module.id ? null : module.id
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ================= MODULE ACCORDION ================= */
function ModuleAccordion({ module, isOpen, onToggle }) {
  return (
    <div
      className="
        rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow
      "
    >
      {/* Module Header */}
      <button
        onClick={onToggle}
        className="
          w-full flex justify-between items-center
          px-5 py-4
          font-semibold text-gray-800
        "
      >
        {module.title}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Lessons */}
      {isOpen && (
        <div className="border-t px-5 py-4 space-y-3">
          {module.lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= LESSON ITEM ================= */
function LessonItem({ lesson }) {
  return (
    <div
      className={`
        flex items-center justify-between
        p-3 rounded-xl
        border
        ${
          lesson.locked
            ? "bg-gray-100 text-gray-400"
            : "bg-white hover:bg-indigo-50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {lesson.locked ? (
          <FaLock />
        ) : lesson.type === "video" ? (
          <FaPlayCircle className="text-indigo-500" />
        ) : (
          <FaFileAlt className="text-emerald-500" />
        )}

        <span className="text-sm font-medium">
          {lesson.title}
        </span>
      </div>

      {lesson.completed && (
        <FaCheckCircle className="text-green-500" />
      )}
    </div>
  );
}

/* ================= LOADING ================= */
function Loading() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 w-1/2 bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded-xl" />
    </div>
  );
}
