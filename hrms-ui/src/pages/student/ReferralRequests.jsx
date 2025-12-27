import { useEffect, useState } from "react";
import {
  FaPaperPlane,
  FaBuilding,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

/* =====================================================
   REFERRAL REQUEST SYSTEM – STUDENT VIEW
===================================================== */

export default function ReferralRequests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    resume: "",
    message: "",
  });

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setRequests([
      {
        id: 1,
        company: "TCS",
        role: "QA Engineer",
        alumni: "Suresh Kumar",
        status: "Approved",
        remarks: "Shared internally with HR",
        date: "2025-01-18",
      },
      {
        id: 2,
        company: "Infosys",
        role: "Test Analyst",
        alumni: "Anitha R",
        status: "Pending",
        remarks: "",
        date: "2025-01-21",
      },
    ]);
  }, []);

  /* ================= HANDLERS ================= */

  const submitRequest = () => {
    if (!form.company || !form.role || !form.resume) return;

    setRequests((r) => [
      {
        id: Date.now(),
        ...form,
        alumni: "Auto Assigned",
        status: "Pending",
        remarks: "",
        date: new Date().toISOString().slice(0, 10),
      },
      ...r,
    ]);

    setForm({
      company: "",
      role: "",
      resume: "",
      message: "",
    });
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Referral Requests
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Request referrals from alumni for job opportunities
        </p>
      </div>

      {/* REQUEST FORM */}
      <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-4">
        <h3 className="font-semibold text-slate-800">
          New Referral Request
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            value={form.company}
            onChange={(v) => setForm({ ...form, company: v })}
          />

          <Input
            label="Job Role"
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
          />

          <Input
            label="Resume Link"
            placeholder="Google Drive / PDF link"
            value={form.resume}
            onChange={(v) => setForm({ ...form, resume: v })}
          />
        </div>

        <Textarea
          label="Message to Alumni (Optional)"
          value={form.message}
          onChange={(v) => setForm({ ...form, message: v })}
        />

        <button
          onClick={submitRequest}
          className="
            flex items-center gap-2
            px-6 py-2 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold
          "
        >
          <FaPaperPlane />
          Submit Request
        </button>
      </div>

      {/* REQUEST LIST */}
      <div className="space-y-4">
        {requests.map((r) => (
          <RequestCard key={r.id} data={r} />
        ))}
      </div>

      {!requests.length && (
        <p className="text-center text-sm text-slate-400">
          No referral requests yet
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const RequestCard = ({ data }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
    <div className="flex justify-between items-start gap-4">
      <div>
        <p className="font-semibold text-slate-800 flex items-center gap-2">
          <FaBuilding />
          {data.company}
        </p>

        <p className="text-sm text-slate-600 flex items-center gap-2">
          <FaUserTie />
          {data.role}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Requested on {data.date}
        </p>
      </div>

      <StatusBadge status={data.status} />
    </div>

    {data.alumni && (
      <p className="text-xs text-slate-600">
        Alumni: <strong>{data.alumni}</strong>
      </p>
    )}

    {data.remarks && (
      <div className="text-sm text-slate-700 bg-white/80 border rounded-xl p-3">
        <strong>Remarks:</strong> {data.remarks}
      </div>
    )}
  </div>
);

/* ================= BADGES ================= */

const StatusBadge = ({ status }) => {
  const map = {
    Approved: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Rejected: {
      icon: <FaTimesCircle />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    Pending: {
      icon: <FaClock />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  };

  const s = map[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}
    >
      {s.icon}
      {status}
    </span>
  );
};

/* ================= INPUTS ================= */

const Input = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 rounded-xl border bg-white/80"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 rounded-xl border bg-white/80"
    />
  </div>
);
