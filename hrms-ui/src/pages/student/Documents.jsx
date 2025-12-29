import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT DOCUMENTS – ADVANCED & SILENT UX
===================================================== */

export default function StudentDocuments() {
  const [documents, setDocuments] = useState([]);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    setDocuments([
      {
        id: 1,
        name: "Resume",
        type: "PDF",
        uploadedOn: "2025-01-05",
        status: "Uploaded",
        mandatory: true,
      },
      {
        id: 2,
        name: "Aadhaar Card",
        type: "PDF",
        uploadedOn: "2024-12-15",
        status: "Uploaded",
        mandatory: true,
      },
      {
        id: 3,
        name: "Offer Letter",
        type: "PDF",
        uploadedOn: null,
        status: "Pending",
        mandatory: false,
      },
    ]);
  }, []);

  /* ================= DERIVED ================= */

  const uploadedCount = documents.filter(
    (d) => d.status === "Uploaded"
  ).length;

  const pendingCount = documents.filter(
    (d) => d.status === "Pending"
  ).length;

  /* ================= HANDLERS ================= */

  const uploadDocument = () => {
    setUploading(true);

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.status === "Pending"
            ? {
                ...d,
                status: "Uploaded",
                uploadedOn: new Date()
                  .toISOString()
                  .slice(0, 10),
              }
            : d
        )
      );

      setUploading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow">
          <FaCheckCircle />
          Document uploaded successfully
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <h2 className="text-2xl font-semibold text-slate-800">
          Documents
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Securely upload and manage your documents
        </p>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Insight label="Total Documents" value={documents.length} />
        <Insight label="Uploaded" value={uploadedCount} />
        <Insight label="Pending" value={pendingCount} highlight />
      </div>

      {/* DOCUMENTS TABLE */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">
            My Documents
          </h3>

          <button
            disabled={uploading || pendingCount === 0}
            onClick={uploadDocument}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white ${
              uploading || pendingCount === 0
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <FaUpload />
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0">
              <tr className="text-left text-slate-500">
                <th className="py-3 px-2">Document</th>
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
                  className="border-b last:border-0 hover:bg-white/60 transition"
                >
                  <td className="py-3 px-2 flex items-center gap-2 font-medium">
                    <FaFileAlt className="text-indigo-600" />
                    {doc.name}
                    {doc.mandatory && (
                      <span className="text-xs text-red-500">
                        *
                      </span>
                    )}
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
                        Awaiting upload
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
   SHARED COMPONENTS
===================================================== */

const Insight = ({ label, value, highlight }) => (
  <div className="bg-white/70 rounded-2xl p-5 shadow border">
    <p className="text-sm text-slate-500">{label}</p>
    <h3
      className={`text-2xl font-bold ${
        highlight ? "text-yellow-600" : "text-slate-800"
      }`}
    >
      {value}
    </h3>
  </div>
);

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
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}
    >
      {s.icon}
      {status}
    </span>
  );
};
