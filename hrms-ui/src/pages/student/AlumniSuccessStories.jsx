import { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaArrowRight,
  FaLightbulb,
  FaQuoteLeft,
} from "react-icons/fa";

/* =====================================================
   ALUMNI SUCCESS STORIES – STUDENT VIEW (READ ONLY)
===================================================== */

export default function AlumniSuccessStories() {
  const [stories, setStories] = useState([]);
  const [openId, setOpenId] = useState(null);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later (admin curated success stories)
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Alumni Success Stories
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Real journeys. Real transformations. Real success.
        </p>
      </div>

      {/* STORIES */}
      <div className="space-y-6">
        {stories.map((s) => (
          <StoryCard
            key={s.id}
            data={s}
            open={openId === s.id}
            onToggle={() =>
              setOpenId(openId === s.id ? null : s.id)
            }
          />
        ))}
      </div>

      {!stories.length && (
        <p className="text-center text-sm text-slate-400">
          Success stories will be updated soon
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const StoryCard = ({ data, open, onToggle }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border transition">
    {/* HEADER */}
    <div className="flex justify-between items-start gap-4">
      <div>
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FaUserGraduate />
          {data.name}
        </h3>
        <p className="text-sm text-slate-500">
          {data.course} • Batch {data.batch}
        </p>
      </div>

      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
        Transformation
      </span>
    </div>

    {/* JOURNEY */}
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <Journey label="Before" value={data.before} />
      <Journey label="After" value={data.after} />
      <Journey label="Duration" value={data.duration} />
    </div>

    {/* EXPAND */}
    {open && (
      <div className="mt-6 space-y-4">
        <blockquote className="text-sm text-slate-700 flex gap-2">
          <FaQuoteLeft className="text-indigo-500 mt-1" />
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
      className="mt-5 flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline"
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

/* ================= SUB ================= */

const Journey = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3 border">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-medium text-slate-800">{value}</p>
  </div>
);
