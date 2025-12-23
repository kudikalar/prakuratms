import { useParams, useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("users")) || { students: [] };
  const batches = JSON.parse(localStorage.getItem("batches")) || [];

  const student = users.students.find((s) => String(s.id) === id);
  const batch = batches.find((b) => b.id === Number(student?.batchId));

  if (!student) return <p>Student not found</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-purple-600"
      >
        ← Back
      </button>

      <div className="bg-white/40 backdrop-blur rounded-3xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
        <p className="text-gray-600">{student.email}</p>

        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Batch:</strong> {batch?.name || "—"}</p>
          <p><strong>Duration:</strong> {batch?.startDate} → {batch?.endDate}</p>
        </div>
      </div>
    </div>
  );
}
