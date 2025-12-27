import { useEffect, useState } from "react";
import {
  FaCertificate,
  FaDownload,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT CERTIFICATES (PRODUCTION READY)
===================================================== */

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setCertificates([
      {
        id: 1,
        title: "Manual Testing Certification",
        issuedBy: "Prakura IT Solutions",
        issuedOn: "2024-11-10",
        status: "Issued",
      },
      {
        id: 2,
        title: "Automation Testing – Playwright",
        issuedBy: "Prakura IT Solutions",
        issuedOn: "2025-01-05",
        status: "Issued",
      },
      {
        id: 3,
        title: "Full Stack Development",
        issuedBy: "Prakura IT Solutions",
        issuedOn: null,
        status: "In Progress",
      },
    ]);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <h2 className="text-2xl font-semibold text-slate-800">
          Certificates
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          View and download your course certificates
        </p>
      </div>

      {/* CERTIFICATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {certificates.map((c) => (
          <CertificateCard key={c.id} data={c} />
        ))}
      </div>

      {!certificates.length && (
        <p className="text-center text-sm text-slate-400">
          No certificates available
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const CertificateCard = ({ data }) => (
  <div
    className="
      bg-white/70 backdrop-blur-xl
      rounded-2xl p-6 shadow
      border border-white/40
      hover:bg-white/80 transition
    "
  >
    {/* TITLE */}
    <div className="flex items-center gap-3 mb-3">
      <FaCertificate className="text-indigo-600 text-xl" />
      <h3 className="font-semibold text-slate-800">
        {data.title}
      </h3>
    </div>

    {/* META */}
    <p className="text-sm text-slate-600">
      Issued By: <span className="font-medium">{data.issuedBy}</span>
    </p>

    <p className="text-xs text-slate-400 mt-1">
      Issued On:{" "}
      {data.issuedOn
        ? new Date(data.issuedOn).toDateString()
        : "—"}
    </p>

    {/* STATUS */}
    <div className="mt-3">
      <StatusBadge status={data.status} />
    </div>

    {/* ACTIONS */}
    {data.status === "Issued" && (
      <div className="mt-5 flex gap-3">
        <button
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white text-sm font-semibold
          "
        >
          <FaEye />
          View
        </button>

        <button
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            border border-indigo-600
            text-indigo-600 hover:bg-indigo-50
            text-sm font-semibold
          "
        >
          <FaDownload />
          Download
        </button>
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Issued: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    "In Progress": {
      icon: <FaCheckCircle />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  };

  const s = map[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1 rounded-full text-xs font-medium
        ${s.bg} ${s.color}
      `}
    >
      {s.icon}
      {status}
    </span>
  );
};
