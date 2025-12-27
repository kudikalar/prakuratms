import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

/* =====================================================
   ALUMNI REFERRAL APPROVAL DASHBOARD
===================================================== */

export default function AlumniReferralDashboard() {
  const [requests, setRequests] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setRequests([
      {
        id: 1,
        student: "Ramesh K",
        course: "QA Automation",
        company: "TCS",
        role: "QA Engineer",
        resume: "https://drive.google.com/resume1",
        status: "Pending",
        message: "Requesting referral for upcoming drive",
      },
      {
        id: 2,
        student: "Anitha R",
        course: "Manual Testing",
        company: "Infosys",
        role: "Test Analyst",
        resume: "https://drive.google.com/resume2",
        status: "Approved",
        message: "Strong profile, ready for referral",
      },
    ]);
  }, []);

  /* ================= ACTIONS ================= */

  const updateStatus = (id, status) => {
    setRequests((r) =>
      r.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    );
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white/70 rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Referral Requests
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review and approve student referral requests
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <RequestCard
            key={r.id}
            data={r}
            onApprove={() => updateStatus(r.id, "Approved")}
            onReject={() => updateStatus(r.id, "Rejected")}
          />
        ))}
      </div>

      {!requests.length && (
        <p className="text-center text-sm text-slate-400">
          No referral requests assigned
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const RequestCard = ({ data, onApprove, onReject }) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow border space-y-3">
    <div className="flex justify-between items-start gap-4">
      <div>
        <p className="font-semibold text-slate-800 flex items-center gap-2">
          <FaUserGraduate /> {data.student}
        </p>
        <p className="text-sm text-slate-600">
          {data.course}
        </p>
        <p className="text-sm flex items-center gap-2 mt-1">
          <FaBuilding /> {data.company} – {data.role}
        </p>
      </div>

      <StatusBadge status={data.status} />
    </div>

    <a
      href={data.resume}
      target="_blank"
      rel="noreferrer"
      className="text-sm text-indigo-600 hover:underline"
    >
      View Resume
    </a>

    <p className="text-sm text-slate-600 italic">
      "{data.message}"
    </p>

    {data.status === "Pending" && (
      <div className="flex gap-3 pt-2">
        <button
          onClick={onApprove}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
        >
          Approve
        </button>

        <button
          onClick={onReject}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
        >
          Reject
        </button>
      </div>
    )}
  </div>
);

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
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
      {s.icon}
      {status}
    </span>
  );
};
