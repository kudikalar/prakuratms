import { useState } from "react";
import {
  FaPlayCircle,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";

/* ================= MOCK LESSON ================= */
const MOCK_LESSON = {
  title: "Playwright Introduction",
  type: "video", // video | slides | notes
  videoUrl: "/media/playwright-intro.mp4",
  slides: [
    "/slides/playwright/slide1.png",
    "/slides/playwright/slide2.png",
    "/slides/playwright/slide3.png",
  ],
  notes: `
    <h2>Playwright Overview</h2>
    <ul>
      <li>Cross-browser testing</li>
      <li>Fast execution</li>
      <li>Auto-wait mechanism</li>
    </ul>
  `,
};

/* ================= MAIN ================= */
export default function LessonPlayer() {
  const [lesson] = useState(MOCK_LESSON);
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl border shadow p-5">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        <p className="text-sm text-gray-600">
          Lesson Type: {lesson.type.toUpperCase()}
        </p>
      </div>

      {/* PLAYER */}
      <div className="rounded-2xl bg-black overflow-hidden shadow-lg">
        {lesson.type === "video" && (
          <video
            controls
            className="w-full h-[420px] bg-black"
            src={lesson.videoUrl}
          />
        )}

        {lesson.type === "slides" && (
          <SlideViewer
            slides={lesson.slides}
            index={slideIndex}
            setIndex={setSlideIndex}
          />
        )}

        {lesson.type === "notes" && (
          <div
            className="p-6 bg-white text-gray-800 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.notes }}
          />
        )}
      </div>
    </div>
  );
}
