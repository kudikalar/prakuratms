import { useEffect, useMemo, useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaArrowRight,
  FaLightbulb,
  FaQuoteLeft,
  FaFilter,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   ALUMNI SUCCESS STORIES – STUDENT VIEW (MOBILE READY)
   ❌ NO CONTENT REMOVED
===================================================== */

export default function AlumniSuccessStories() {
  const [stories, setStories] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [engaged, setEngaged] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    setStories([
      {
        id: 1,
        name: "Suresh Kumar",
        course: "QA Automation",
        batch: "2023",
        before: "Non-IT Background, Fresher",
        after: "QA Engineer @ TCS",
        company: "TCS",
        duration: "6 Months",
        tags: ["Non-IT → IT"],
        story:
          "I joined Prakura with zero IT knowledge. The structured training, mock interviews, and daily practice changed everything.",
        learnings: [
          "Strong testing fundamentals",
          "Automation framework confidence",
          "Interview readiness",
        ],
        advice:
          "Consistency matters more than speed. Practice daily and trust the process.",
      },
      {
        id: 2,
        name: "Anitha R",
        course: "Manual Testing",
        batch: "2022",
        before: "Career gap of 2 years",
        after: "Test Analyst @ Infosys",
        company: "Infosys",
        duration: "4 Months",
        tags: ["Career Gap", "Fast Track"],
        story:
          "The mentors helped me regain confidence. Real-time projects and resume guidance played a major role.",
        learnings: [
          "Test case design",
          "Defect tracking",
          "HR interview handling",
        ],
        advice:
          "Never underestimate fundamentals. They decide your confidence in interviews.",
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const companies = useMemo(
    () => [...new Set(stories.map((s) => s.company))],
    [stories]
  );

  const filteredStories =
    filter === "All"
      ? stories
      : stories.filter(
          (s) => s.course === filter || s.company === filter
        );

  /* ================= UI ================= */

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">

      {/* ENGAGEMENT SUCCESS */}
      {engaged && (
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow text-sm">
          <FaCheckCircle />
          You explored a real alumni success story
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow border">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
          Alumni Success Stories
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Real journeys. Real transformations. Real success.
        </p>
      </div>

      {/* IMPACT SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Stat label="Alumni Placed" value={stories.length} />
        <Stat label="Hiring Companies" value={companies.length} />
        <Stat label="Avg Duration" value="5 Months" highlight />
      </div>

      {/* FILTER – MOBILE SCROLLABLE */}
      <div className="flex items-center gap-2 text-sm overflow-x-auto pb-1">
        <FaFilter className="text-slate-500 shrink-0" />
        {["All", "QA Automation", "Manual Testing", ...companies].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full border transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white/80 text-slate-700"
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* STORIES */}
      <div className="space-y-4 md:space-y-6">
        {filteredStories.map((s) => (
          <StoryCard
            key={s.id}
            data={s}
            open={openId === s.id}
            onToggle={() => {
              setOpenId(openId === s.id ? null : s.id);
              setEngaged(true);
              setTimeout(() => setEngaged(false), 3000);
            }}
          />
        ))}
      </div>

      {!filteredStories.length && (
        <p className="text-center text-xs md:text-sm text-slate-400">
          Success stories will be updated soon
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS (MOBILE SAFE)
===================================================== */

const Stat = ({ label, value, highlight }) => (
  <div className="bg-white/80 rounded-2xl p-4 md:p-5 shadow border">
    <p className="text-xs md:text-sm text-slate-500">{label}</p>
    <h3
      className={`text-xl md:text-2xl font-bold ${
        highlight ? "text-indigo-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

const StoryCard = ({ data, open, onToggle }) => (
  <div className="bg-white/80 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow border">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
      <div>
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FaUserGraduate />
          {data.name}
        </h3>
        <p className="text-xs md:text-sm text-slate-500">
          {data.course} • Batch {data.batch}
        </p>
      </div>

      <span className="self-start px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
        Placed @ {data.company}
      </span>
    </div>

    {/* JOURNEY */}
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <Journey label="Before" value={data.before} />
      <Journey label="After" value={data.after} highlight />
      <Journey label="Duration" value={data.duration} />
    </div>

    {/* TAGS */}
    <div className="flex flex-wrap gap-2 mt-4">
      {data.tags.map((t, i) => (
        <span
          key={i}
          className="px-3 py-1 text-[11px] rounded-full bg-indigo-100 text-indigo-700"
        >
          {t}
        </span>
      ))}
    </div>

    {/* EXPAND */}
    {open && (
      <div className="mt-5 space-y-4">
        <blockquote className="text-sm text-slate-700 flex gap-2">
          <FaQuoteLeft className="text-indigo-500 mt-1 shrink-0" />
          {data.story}
        </blockquote>

        <div>
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Key Learnings
          </p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {data.learnings.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
          <FaLightbulb className="inline mr-2" />
          <strong>Advice:</strong> {data.advice}
        </div>
      </div>
    )}

    {/* TOGGLE */}
    <button
      onClick={onToggle}
      className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline"
    >
      {open ? "Show Less" : "Read Full Story"}
      <FaArrowRight
        className={`transition-transform ${
          open ? "rotate-90" : ""
        }`}
      />
    </button>
  </div>
);

const Journey = ({ label, value, highlight }) => (
  <div
    className={`rounded-xl p-3 border ${
      highlight ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"
    }`}
  >
    <p className="text-[11px] text-slate-500">{label}</p>
    <p className="font-medium text-slate-800 text-sm">{value}</p>
  </div>
);
