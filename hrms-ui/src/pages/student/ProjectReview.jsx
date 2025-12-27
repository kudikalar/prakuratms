import { useEffect, useState } from "react";
import {
  FaUserTie,
  FaCommentDots,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECT REVIEW & MENTOR FEEDBACK
===================================================== */

export default function ProjectReview() {
  const [reviews, setReviews] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setReviews([
      {
        id: 1,
        project: "HRMS Automation Testing",
        mentor: "Suresh Kumar",
        date: "2025-01-10",
        status: "Changes Required",
        feedback:
          "Improve test coverage, add edge cases, and refactor locator strategy.",
        score: 6.5,
      },
      {
        id: 2,
        project: "E-Commerce Manual Testing",
        mentor: "Anitha R",
        date: "2024-12-28",
        status: "Approved",
        feedback:
          "Good documentation and defect reporting. Ready for interviews.",
        score: 8.5,
      },
    ]);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Project Review & Mentor Feedback
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review comments and improvement suggestions from mentors
        </p>
      </div>

      {/* REVIEWS */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {!reviews.length && (
        <p className="text-center text-sm text-slate-400">
          No mentor reviews available yet
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-800">
            {review.project}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <FaUserTie />
            {review.mentor} • {review.date}
          </p>
        </div>

        <StatusBadge status={review.status} />
      </div>

      {/* FEEDBACK */}
      <div className="bg-white/80 border rounded-xl p-4">
        <p className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
          <FaCommentDots />
          Mentor Feedback
        </p>
        <p className="text-sm text-slate-700">
          {review.feedback}
        </p>
      </div>

      {/* SCORE */}
      <div className="flex justify-end">
        <span className="text-sm font-semibold text-indigo-600">
          Review Score: {review.score} / 10
        </span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Approved: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
    },
    "Changes Required": {
      icon: <FaExclamationCircle />,
      color: "text-yellow-600",
    },
    Rejected: {
      icon: <FaTimesCircle />,
      color: "text-red-600",
    },
  };

  return (
    <span
      className={`flex items-center gap-2 text-sm font-semibold ${
        map[status]?.color
      }`}
    >
      {map[status]?.icon}
      {status}
    </span>
  );
};
