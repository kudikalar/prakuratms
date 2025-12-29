import { useState, useMemo } from "react";
import { FaBrain, FaCheckCircle } from "react-icons/fa";

/* =====================================================
   AI-STYLE ALUMNI STORY MATCHER (SMART + SILENT UX)
===================================================== */

export default function AlumniStoryMatcher({ stories = [] }) {
  const [profile, setProfile] = useState({
    course: "",
    background: "",
    gap: "",
  });
  const [result, setResult] = useState(null);

  /* ================= MATCH ENGINE ================= */

  const calculateScore = (story) => {
    let score = 0;

    if (profile.course && story.course === profile.course) {
      score += 40;
    }

    if (
      profile.background &&
      story.before.toLowerCase().includes(
        profile.background.toLowerCase()
      )
    ) {
      score += 30;
    }

    if (
      profile.gap &&
      story.before.toLowerCase().includes("gap")
    ) {
      score += 20;
    }

    if (story.duration && story.duration.includes("4")) {
      score += 10;
    }

    return score;
  };

  const findBestMatch = () => {
    const scored = stories
      .map((s) => ({
        ...s,
        score: calculateScore(s),
      }))
      .sort((a, b) => b.score - a.score);

    setResult(scored[0] || null);
  };

  /* ================= DERIVED ================= */

  const canMatch = useMemo(
    () => profile.course || profile.background || profile.gap,
    [profile]
  );

  /* ================= UI ================= */

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow border space-y-5">
      {/* HEADER */}
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <FaBrain className="text-indigo-600" />
        Which Alumni Story Fits You?
      </h3>

      {/* INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Target Course"
          value={profile.course}
          onChange={(v) =>
            setProfile({ ...profile, course: v })
          }
          options={[
            "QA Automation",
            "Manual Testing",
          ]}
        />

        <Select
          label="Your Background"
          value={profile.background}
          onChange={(v) =>
            setProfile({ ...profile, background: v })
          }
          options={["Non-IT", "Career gap", "IT Fresher"]}
        />

        <Select
          label="Career Gap"
          value={profile.gap}
          onChange={(v) =>
            setProfile({ ...profile, gap: v })
          }
          options={["Yes", "No"]}
        />
      </div>

      {/* ACTION */}
      <button
        disabled={!canMatch}
        onClick={findBestMatch}
        className={`px-6 py-2 rounded-xl font-semibold text-white transition ${
          canMatch
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-slate-300 cursor-not-allowed"
        }`}
      >
        Find My Best Match
      </button>

      {/* RESULT */}
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
          <p className="font-semibold text-emerald-800 flex items-center gap-2">
            <FaCheckCircle />
            Based on your profile, this story fits you
          </p>

          <p className="text-slate-800 font-medium">
            {result.name} • {result.after}
          </p>

          <p className="text-sm text-slate-600">
            Similar journey: {result.before}
          </p>

          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              Match Confidence: {Math.min(result.score, 95)}%
            </span>
          </div>
        </div>
      )}

      {!result && canMatch && (
        <p className="text-sm text-slate-500">
          We’ll find the closest real-world success story
          matching your journey.
        </p>
      )}
    </div>
  );
}

/* =====================================================
   SUB COMPONENTS
===================================================== */

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 rounded-xl border bg-white/80"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
