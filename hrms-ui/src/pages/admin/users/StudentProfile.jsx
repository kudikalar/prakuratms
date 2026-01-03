import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    // ✅ ONLY logged-in student
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const batches = JSON.parse(localStorage.getItem("batches")) || [];

    if (!loggedInUser) {
      navigate("/login", { replace: true });
      return;
    }

    setStudent(loggedInUser);

    if (loggedInUser.batchId) {
      const assignedBatch = batches.find(
        (b) => String(b.id) === String(loggedInUser.batchId)
      );
      setBatch(assignedBatch || null);
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-purple-600 hover:underline"
      >
        ← Back
      </button>

      {/* PROFILE CARD */}
      <div className="bg-white/40 backdrop-blur rounded-3xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-1 text-slate-800">
          {student.name}
        </h2>
        <p className="text-slate-600">{student.email}</p>

        <div className="mt-5 space-y-2 text-sm text-slate-700">
          <ProfileRow label="Course" value={student.course || "—"} />
          <ProfileRow label="Phone" value={student.phone || "—"} />

          <ProfileRow
            label="Batch"
            value={batch?.name || "Not Assigned"}
          />

          <ProfileRow
            label="Duration"
            value={
              batch
                ? `${batch.startDate} → ${batch.endDate}`
                : "—"
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium">{label}</span>
    <span>{value}</span>
  </div>
);
