import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";
import { useState } from "react";

export default function SlideViewer({ slides = [] }) {
  const [index, setIndex] = useState(0);

  if (!slides.length) {
    return (
      <div className="h-[420px] flex items-center justify-center text-gray-400">
        No slides available
      </div>
    );
  }

  return (
    <div className="relative bg-black h-[420px] flex items-center justify-center">
      <img
        src={slides[index]}
        alt={`Slide ${index + 1}`}
        className="max-h-full max-w-full object-contain"
      />

      {/* Prev */}
      <button
        disabled={index === 0}
        onClick={() => setIndex((i) => i - 1)}
        className="absolute left-4 bg-white/80 p-2 rounded-full disabled:opacity-40"
      >
        <FaChevronLeft />
      </button>

      {/* Next */}
      <button
        disabled={index === slides.length - 1}
        onClick={() => setIndex((i) => i + 1)}
        className="absolute right-4 bg-white/80 p-2 rounded-full disabled:opacity-40"
      >
        <FaChevronRight />
      </button>

      {/* Footer */}
      <div className="absolute bottom-3 text-white text-sm bg-black/60 px-3 py-1 rounded">
        Slide {index + 1} / {slides.length}
      </div>

      {/* Fullscreen */}
      <button
        onClick={() => document.documentElement.requestFullscreen()}
        className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded"
      >
        <FaExpand />
      </button>
    </div>
  );
}
