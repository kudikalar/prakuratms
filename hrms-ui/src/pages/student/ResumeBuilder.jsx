import { useEffect, useState, useMemo } from "react";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram,
  FaTools,
  FaSave,
  FaChartPie,
  FaEye,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT RESUME BUILDER – PREMIUM
===================================================== */

export default function ResumeBuilder() {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
  });

  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    const savedResume = localStorage.getItem("student_resume");
    if (savedResume) {
      setResume(JSON.parse(savedResume));
    } else {
      try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        setResume((r) => ({
          ...r,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      } catch {}
    }
  }, []);

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("student_resume", JSON.stringify(resume));
      setSaved(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [resume]);

  /* ================= HELPERS ================= */

  const update = (field, value) => {
    setSaved(false);
    setResume((r) => ({ ...r, [field]: value }));
  };

  const completion = useMemo(() => {
    return Math.round(
      (Object.values(resume).filter(Boolean).length /
        Object.keys(resume).length) *
        100
    );
  }, [resume]);

  const quality =
    completion >= 85 ? "Placement Ready" :
    completion >= 65 ? "Good Progress" :
    "Needs Improvement";

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Resume Builder
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Build an ATS-friendly, placement-ready resume
            </p>
          </div>

          <button
            onClick={() => setPreview((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            {preview ? <FaEdit /> : <FaEye />}
            {preview ? "Edit Mode" : "Preview"}
          </button>
        </div>
      </div>

      {/* COMPLETION */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Completion" value={`${completion}%`} />
        <Stat label="Resume Quality" value={quality} highlight />
        <Stat
          label="Auto Save"
          value={saved ? "Saved" : "Editing"}
          icon={<FaCheckCircle />}
        />
      </div>

      {!preview ? (
        <>
          {/* FORM SECTIONS */}
          <Section title="Personal Details" icon={<FaUser />}>
            <Input label="Full Name" value={resume.name} onChange={(v) => update("name", v)} />
            <Input label="Email" value={resume.email} onChange={(v) => update("email", v)} />
            <Input label="Phone" value={resume.phone} onChange={(v) => update("phone", v)} />
          </Section>

          <Section title="Professional Summary" icon={<FaBriefcase />} hint="2–3 impactful lines recruiters read first">
            <Textarea
              placeholder="QA professional with hands-on automation experience..."
              value={resume.summary}
              onChange={(v) => update("summary", v)}
            />
          </Section>

          <Section title="Skills" icon={<FaTools />} hint="Comma separated (ATS friendly)">
            <Textarea
              placeholder="Manual Testing, Playwright, SQL, API Testing"
              value={resume.skills}
              onChange={(v) => update("skills", v)}
            />
          </Section>

          <Section title="Education" icon={<FaGraduationCap />}>
            <Textarea
              placeholder="Degree, College, Year"
              value={resume.education}
              onChange={(v) => update("education", v)}
            />
          </Section>

          <Section title="Experience" icon={<FaBriefcase />} hint="Internships / work exposure">
            <Textarea
              placeholder="Intern QA – test case design, defect tracking..."
              value={resume.experience}
              onChange={(v) => update("experience", v)}
            />
          </Section>

          <Section title="Projects" icon={<FaProjectDiagram />} hint="Most important for freshers">
            <Textarea
              placeholder="HRMS automation using Playwright, CI pipeline..."
              value={resume.projects}
              onChange={(v) => update("projects", v)}
            />
          </Section>
        </>
      ) : (
        /* PREVIEW */
        <div className="bg-white/70 rounded-2xl p-8 shadow border space-y-4">
          <h3 className="text-xl font-semibold text-slate-800">
            {resume.name}
          </h3>
          <p className="text-sm text-slate-600">
            {resume.email} • {resume.phone}
          </p>

          <Preview title="Summary" content={resume.summary} />
          <Preview title="Skills" content={resume.skills} />
          <Preview title="Education" content={resume.education} />
          <Preview title="Experience" content={resume.experience} />
          <Preview title="Projects" content={resume.projects} />
        </div>
      )}

      {/* MANUAL SAVE */}
      <div className="flex justify-end">
        <button
          onClick={() => localStorage.setItem("student_resume", JSON.stringify(resume))}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          <FaSave />
          Save Resume
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Stat = ({ label, value, highlight, icon }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border text-center">
    <p className="text-xs text-slate-500">{label}</p>
    <h3 className={`text-xl font-bold mt-1 ${highlight ? "text-indigo-600" : "text-slate-800"}`}>
      {value}
    </h3>
    {icon && <div className="text-emerald-600 mt-1">{icon}</div>}
  </div>
);

const Section = ({ title, icon, children, hint }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-slate-800 font-semibold">
        {icon}
        {title}
      </div>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
    {children}
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 rounded-xl border bg-white/80"
    />
  </div>
);

const Textarea = ({ value, onChange, placeholder }) => (
  <textarea
    rows={4}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-2 rounded-xl border bg-white/80"
  />
);

const Preview = ({ title, content }) => (
  content ? (
    <div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-700 whitespace-pre-line">{content}</p>
    </div>
  ) : null
);
