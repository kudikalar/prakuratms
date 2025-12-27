import { useEffect, useState } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

/* =====================================================
   MOCK INTERVIEW RESULTS – NEXT LEVEL
===================================================== */

const PAGE_SIZE = 4;

export default function MockInterviewResults() {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setResults([
      {
        id: 1,
        technology: "Playwright JS",
        interviewer: "Automation Lead – Suresh",
        score: 8,
        status: "Pass",
        feedback:
          "Strong automation concepts. Improve framework explanation.",
      },
      {
        id: 2,
        technology: "Manual Testing",
        interviewer: "Senior QA – Ramesh",
        score: 6,
        status: "Needs Improvement",
        feedback:
          "Good fundamentals but needs better real-time examples.",
      },
      {
        id: 3,
        technology: "SQL Testing",
        interviewer: "DB Expert – Prakash",
        score: 9,
        status: "Pass",
        feedback: "Excellent query optimization and joins.",
      },
      {
        id: 4,
        technology: "Java Basics",
        interviewer: "Tech Panel",
        score: 5,
        status: "Needs Improvement",
        feedback: "Revise OOPs concepts and collections.",
      },
    ]);
  }, []);

  /* ================= STATS ================= */

  const passed = results.filter((r) => r.status === "Pass").length;
  const avgScore = results.length
    ? (
        results.reduce((a, b) => a + b.score, 0) / results.length
      ).toFixed(1)
    : 0;

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const paginated = results.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Mock Interview Results
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Performance insights and mentor feedback
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Summary label="Total Interviews" value={results.length} />
        <Summary label="Passed" value={passed} />
        <Summary label="Avg Score" value={avgScore} />
      </div>

      {/* RESULTS */}
      <div className="space-y-4">
        {paginated.map((r) => (
          <ResultCard key={r.id} data={r} />
        ))}
      </div>

      {!results.length && (
        <p className="text-center text-sm text-slate-400">
          No results available
        </p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded border disabled:opacity-40"
          >
            <FaArrowLeft />
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border disabled:opacity-40"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Summary = ({ label, value }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3 className="text-2xl font-bold text-indigo-600 mt-1">
      {value}
    </h3>
  </div>
);

const ResultCard = ({ data }) => {
  const confidence =
    data.score >= 8
      ? "Strong"
      : data.score >= 6
      ? "Average"
      : "Weak";

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
      <div className="flex justify-between gap-6">
        {/* LEFT */}
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-800">
            {data.technology}
          </h3>

          <p className="text-sm text-slate-600">
            Interviewer: {data.interviewer}
          </p>

          <p className="text-sm text-slate-700">
            <strong>Feedback:</strong> {data.feedback}
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-right space-y-2">
          <Score score={data.score} />
          <ResultStatus status={data.status} />
          <p className="text-xs text-slate-500">
            Confidence:{" "}
            <span className="font-semibold">
              {confidence}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Score = ({ score }) => (
  <div className="flex justify-end items-center gap-1 text-yellow-500">
    {Array.from({ length: score }).map((_, i) => (
      <FaStar key={i} />
    ))}
    <span className="text-sm text-slate-600 ml-1">
      ({score}/10)
    </span>
  </div>
);

const ResultStatus = ({ status }) => {
  const map = {
    Pass: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
    },
    "Needs Improvement": {
      icon: <FaTimesCircle />,
      color: "text-yellow-600",
    },
  };

  const s = map[status];

  return (
    <div className={`flex justify-end items-center gap-2 text-sm ${s.color}`}>
      {s.icon}
      {status}
    </div>
  );
};
