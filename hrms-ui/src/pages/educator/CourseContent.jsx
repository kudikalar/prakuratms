import { useEffect, useMemo, useState } from "react";
import {
  FaPlayCircle,
  FaFileAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

/* ================= MOCK COURSE DATA ================= */
const MOCK_COURSE = {
  title: "Playwright Automation Testing",
  description:
    "Enterprise-grade end-to-end automation testing using Playwright with real-time frameworks, CI/CD integration, and industry projects.",
  level: "Advanced",
  duration: "6 Weeks",
  modules: [
    {
      id: 1,
      title: "Module 1: Introduction to Playwright",
      outcome: "Understand Playwright architecture and ecosystem",
      duration: "4 Hours",
      lessons: [
        {
          id: 11,
          title: "What is Playwright?",
          type: "video",
          completed: true,
          videoUrl: "/media/playwright-intro.mp4",
        },
        {
          id: 12,
          title: "Why Playwright over Selenium?",
          type: "slides",
          completed: true,
          slides: [
            "/slides/playwright/slide1.png",
            "/slides/playwright/slide2.png",
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Module 2: Setup & Configuration",
      outcome: "Set up enterprise-ready Playwright projects",
      duration: "6 Hours",
      lessons: [
        {
          id: 21,
          title: "Installing Playwright",
          type: "video",
          completed: false,
          videoUrl: "/media/playwright-install.mp4",
        },
        {
          id: 22,
          title: "Project Structure & Config",
          type: "slides",
          completed: false,
          slides: [
            "/slides/playwright/setup1.png",
            "/slides/playwright/setup2.png",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Module 3: Test Script Development",
      outcome: "Write scalable and maintainable test scripts",
      duration: "8 Hours",
      locked: true,
      lessons: [
        {
          id: 31,
          title: "Writing Your First Test",
          type: "video",
          locked: true,
        },
      ],
    },
  ],
};

/* ================= MAIN ================= */
export default function CourseContent() {
  const [course, setCourse] = useState(null);
  const [openModule, setOpenModule] = useState(null);

  /* ✅ ADDED */
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    setCourse(MOCK_COURSE);
  }, []);

  const progress = useMemo(() => {
    if (!course) return 0;
    const lessons = course.modules.flatMap((m) => m.lessons);
    const completed = lessons.filter((l) => l.completed).length;
    return Math.round((completed / lessons.length) * 100);
  }, [course]);

  if (!course) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ================= LEFT: COURSE CONTENT ================= */}
      <div className="lg:col-span-1 space-y-6">
        {/* ================= COURSE HEADER ================= */}
        <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-xl border shadow">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {course.description}
              </p>
            </div>

            <div className="flex gap-4 text-sm text-gray-700">
              <Meta label="Level" value={course.level} />
              <Meta label="Duration" value={course.duration} />
              <Meta
                label="Progress"
                value={`${progress}%`}
                icon={<FaChartLine />}
              />
            </div>

            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
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
              onLessonSelect={setActiveLesson} /* ✅ ADDED */
            />
          ))}
        </div>
      </div>

      {/* ================= RIGHT: CONTENT VIEWER ================= */}
      <div className="lg:col-span-2">
        {activeLesson ? (
          <LessonViewer lesson={activeLesson} />
        ) : (
          <div className="h-[420px] rounded-2xl bg-white/60 border shadow flex items-center justify-center text-gray-500">
            Select a lesson to preview video / slides
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MODULE ================= */
function ModuleAccordion({ module, isOpen, onToggle, onLessonSelect }) {
  const completedCount = module.lessons.filter((l) => l.completed).length;
  const progress = Math.round(
    (completedCount / module.lessons.length) * 100
  );

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl border shadow">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex justify-between items-center"
      >
        <div>
          <h3 className="font-semibold text-gray-800">{module.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {module.outcome}
          </p>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      <div className="px-5 pb-3 flex gap-6 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <FaClock /> {module.duration}
        </span>
        <span>{progress}% Completed</span>
      </div>

      {isOpen && (
        <div className="border-t px-5 py-4 space-y-3">
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              onClick={() =>
                !lesson.locked && onLessonSelect(lesson)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= LESSON ITEM ================= */
function LessonItem({ lesson, onClick }) {
  const disabled = lesson.locked;

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-indigo-50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {disabled ? (
          <FaLock />
        ) : lesson.type === "video" ? (
          <FaPlayCircle className="text-indigo-600" />
        ) : (
          <FaFileAlt className="text-emerald-600" />
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

/* ================= CONTENT VIEWER ================= */
function LessonViewer({ lesson }) {
  return (
    <div className="rounded-2xl bg-black shadow overflow-hidden">
      {lesson.type === "video" && (
        <video
          controls
          className="w-full h-[420px]"
          src={lesson.videoUrl}
        />
      )}

      {lesson.type === "slides" && (
        <SlideViewer slides={lesson.slides} />
      )}
    </div>
  );
}

/* ================= SLIDE VIEWER (INLINE – NO REMOVALS) ================= */
function SlideViewer({ slides = [] }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative bg-black h-[420px] flex items-center justify-center">
      <img
        src={slides[index]}
        className="max-h-full max-w-full object-contain"
      />

      <button
        disabled={index === 0}
        onClick={() => setIndex(index - 1)}
        className="absolute left-4 bg-white/80 p-2 rounded-full"
      >
        ‹
      </button>

      <button
        disabled={index === slides.length - 1}
        onClick={() => setIndex(index + 1)}
        className="absolute right-4 bg-white/80 p-2 rounded-full"
      >
        ›
      </button>

      <div className="absolute bottom-3 text-white text-sm bg-black/60 px-3 py-1 rounded">
        Slide {index + 1} / {slides.length}
      </div>
    </div>
  );
}

/* ================= META ================= */
function Meta({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* ================= LOADING ================= */
function Loading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-6 w-1/2 bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded-xl" />
    </div>
  );
}
