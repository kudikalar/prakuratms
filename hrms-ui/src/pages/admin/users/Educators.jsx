import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Toast from "../../../components/Toast";

/* ================= DEFAULTS ================= */

const emptyEducator = {
  id: null,
  name: "",
  email: "",
  course: "",
};

export default function Educators() {
  const [educators, setEducators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyEducator);
  const [editing, setEditing] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    const storedCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    setEducators(users.educators || []);
    setCourses(storedCourses);
  }, []);

  /* ================= SAVE ================= */
  const saveEducator = () => {
    if (!form.name || !form.email || !form.course) {
      setToast("⚠️ Please fill all fields");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    let updated;

    if (editing) {
      updated = users.educators.map((e) =>
        e.id === form.id ? form : e
      );
      setToast("✅ Educator updated successfully");
    } else {
      updated = [
        ...users.educators,
        { ...form, id: Date.now() },
      ];
      setToast("✅ Educator added successfully");
    }

    users.educators = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setEducators(updated);
    setForm(emptyEducator);
    setEditing(false);

    setTimeout(() => setToast(""), 2500);
  };

  /* ================= EDIT ================= */
  const startEdit = (educator) => {
    setForm(educator);
    setEditing(true);
  };

  /* ================= DELETE ================= */
  const deleteEducator = () => {
    const users = JSON.parse(localStorage.getItem("users"));

    const updated = users.educators.filter(
      (e) => e.id !== confirmId
    );

    users.educators = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setEducators(updated);
    setConfirmId(null);
    setToast("🗑️ Educator deleted");

    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="max-w-5xl space-y-8 text-gray-800">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold">Educators</h2>
        <p className="text-sm text-gray-600">
          Manage educators and assign courses
        </p>
      </div>

      {/* ================= FORM ================= */}
      <GlassCard>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Educator Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="p-3 rounded-xl bg-white/70 border"
          />

          <input
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="p-3 rounded-xl bg-white/70 border"
          />

          <select
            value={form.course}
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
            className="p-3 rounded-xl bg-white/70 border"
          >
            <option value="">Assign Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={saveEducator}
          className="
            mt-4 flex items-center gap-2
            px-6 py-2.5 rounded-full
            bg-purple-600 hover:bg-purple-700
            text-white font-semibold shadow
          "
        >
          <FaPlus />
          {editing ? "Update Educator" : "Add Educator"}
        </button>
      </GlassCard>

      {/* ================= LIST ================= */}
      <div className="grid gap-4">
        {educators.map((e) => (
          <GlassCard key={e.id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{e.name}</h3>
                <p className="text-sm text-gray-600">{e.email}</p>
                <span className="text-xs text-purple-700">
                  Course: {e.course}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(e)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmId(e.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ================= CONFIRM DELETE ================= */}
      {confirmId && (
        <ConfirmModal
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteEducator}
        />
      )}

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= CONFIRM MODAL ================= */

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-80 space-y-4 shadow-xl">
      <h3 className="font-semibold text-lg">Delete Educator?</h3>
      <p className="text-sm text-gray-600">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ================= GLASS CARD ================= */

const GlassCard = ({ children }) => (
  <div
    className="
      bg-white/40 backdrop-blur-[24px]
      border border-white/40
      rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
    "
  >
    {children}
  </div>
);
