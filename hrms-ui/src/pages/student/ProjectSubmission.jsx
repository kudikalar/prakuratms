import { useEffect, useState } from "react";
import {
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaHistory,
  FaLock,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROJECT SUBMISSION & APPROVAL (NEXT LEVEL)
===================================================== */

export default function ProjectSubmission() {
  const [submission, setSubmission] = useState(null);
  const [repoLink, setRepoLink] = useState("");
  const [docLink, setDocLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= INIT ================= */

  useEffect(() => {
    setSubmission({
      status: "Pending Review", // Approved | Rejected | Pending Review
      remarks: "Mentor review pending",
      submittedOn: "2025-01-15",
      history: [
        {
          date: "2025-01-15",
          repo: "https://github.com/user/project-v1",
          doc: "https://drive.google.com/doc-v1",
        },
      ],
    });
  }, []);

  /* ================= HELPERS ================= */

  const locked =
    submission?.status === "Pending Review" ||
    submission?.status === "Approved";

  /* ================= HANDLERS ================= */

  const submitProject = () => {
    setError("");

    if (!repoLink || !docLink) {
      setError("Repository and documentation links are required");
      return;
    }

    if (!repoLink.includes("github.com")) {
      setError("Please provide a valid GitHub repository link");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSubmission((prev) => ({
        status: "Pending Review",
        remarks: "Submission received. Mentor will review shortly.",
        submittedOn: new Date().toISOString().slice(0, 10),
        history: [
          {
            date: new Date().toISOString().slice(0, 10),
            repo: repoLink,
            doc: docLink,
          },
          ...(prev?.history || []),
        ],
      }));

      setLoading(false);
      setRepoLink("");
      setDocLink("");
    }, 1200);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Project Submission
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Submit final project artifacts for mentor approval
        </p>
      </div>

      {/* SUBMISSION FORM */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          Submission Details
          {locked && (
            <span className="text-xs flex items-center gap-1 text-slate-500">
              <FaLock /> Locked
            </span>
          )}
        </h3>

        <Input
          label="GitHub / Repository Link"
          value={repoLink}
          onChange={setRepoLink}
          placeholder="https://github.com/username/project"
          disabled={locked}
        />

        <Input
          label="Project Documentation Link"
          value={docLink}
          onChange={setDocLink}
          placeholder="Google Drive / PDF link"
          disabled={locked}
        />

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        {!locked && (
          <button
            onClick={submitProject}
            disabled={loading}
            className="
              flex items-center gap-2
              px-6 py-2 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold
              disabled:opacity-60
            "
          >
            <FaUpload />
            {loading ? "Submitting..." : "Submit Project"}
          </button>
        )}
      </div>

      {/* STATUS */}
      {submission && (
        <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
          <h3 className="font-semibold text-slate-800">
            Submission Status
          </h3>

          <StatusBadge status={submission.status} />

          <p className="text-sm text-slate-600 flex items-center gap-2">
            <FaFileAlt />
            Submitted on: {submission.submittedOn}
          </p>

          <div className="bg-white/80 border rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Mentor Remarks
            </p>
            <p className="text-sm text-slate-600">
              {submission.remarks}
            </p>
          </div>
        </div>
      )}

      {/* VERSION HISTORY */}
      {submission?.history?.length > 0 && (
        <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FaHistory /> Submission History
          </h3>

          {submission.history.map((h, i) => (
            <div
              key={i}
              className="text-sm border rounded-xl p-3 bg-white/80"
            >
              <p className="font-medium text-slate-700">
                {h.date}
              </p>
              <p className="text-slate-600">
                Repo: {h.repo}
              </p>
              <p className="text-slate-600">
                Docs: {h.doc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <input
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full mt-1 px-4 py-2 rounded-xl border
        bg-white/80 disabled:bg-slate-100
      "
    />
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Approved: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
    },
    "Pending Review": {
      icon: <FaClock />,
      color: "text-yellow-600",
    },
    Rejected: {
      icon: <FaTimesCircle />,
      color: "text-red-600",
    },
  };

  return (
    <span
      className={`flex items-center gap-2 font-semibold ${map[status]?.color}`}
    >
      {map[status]?.icon}
      {status}
    </span>
  );
};
