import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT DOCUMENTS (PRODUCTION READY)
===================================================== */

export default function StudentDocuments() {
  const [documents, setDocuments] = useState([]);

  /* ================= INIT ================= */

  useEffect(() => {
    // 🔹 Replace with API later
    setDocuments([
      {
        id: 1,
        name: "Resume",
        type: "PDF",
        uploadedOn: "2025-01-05",
        status: "Uploaded",
      },
      {
        id: 2,
        name: "Aadhaar Card",
        type: "PDF",
        uploadedOn: "2024-12-15",
        status: "Uploaded",
      },
      {
        id: 3,
        name: "Offer Letter",
        type: "PDF",
        uploadedOn: null,
        status: "Pending",
      },
    ]);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <h2 className="text-2xl font-semibold text-slate-800">
          Documents
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload and manage your personal and academic documents
        </p>
      </div>

      {/* DOCUMENTS LIST */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border border-white/40">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">
            My Documents
          </h3>

          <button
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white text-sm font-semibold
            "
          >
            <FaUpload />
            Upload Document
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Document</th>
                <th>Type</th>
                <th>Status</th>
                <th>Uploaded On</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b last:border-0 hover:bg-white/60"
                >
                  <td className="py-3 flex items-center gap-2">
                    <FaFileAlt className="text-indigo-600" />
                    {doc.name}
                  </td>
                  <td>{doc.type}</td>
                  <td>
                    <StatusBadge status={doc.status} />
                  </td>
                  <td>
                    {doc.uploadedOn
                      ? new Date(doc.uploadedOn).toDateString()
                      : "—"}
                  </td>
                  <td>
                    {doc.status === "Uploaded" ? (
                      <div className="flex gap-3">
                        <button className="text-indigo-600 hover:underline flex items-center gap-1">
                          <FaEye />
                          View
                        </button>
                        <button className="text-indigo-600 hover:underline flex items-center gap-1">
                          <FaDownload />
                          Download
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400">
                        Not uploaded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!documents.length && (
          <p className="text-sm text-slate-400 text-center mt-4">
            No documents available
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const StatusBadge = ({ status }) => {
  const map = {
    Uploaded: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Pending: {
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
