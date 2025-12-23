import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Toast from "../../../components/Toast";

/* ================= HELPERS ================= */

const emptyAdmin = {
  id: null,
  name: "",
  email: "",
};

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyAdmin);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    setAdmins(users.admins);
  }, []);

  /* ================= SAVE ================= */
  const saveAdmin = () => {
    if (!form.name || !form.email) return;

    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    let updated;

    if (editing) {
      updated = users.admins.map((a) =>
        a.id === form.id ? form : a
      );
      setToast("✅ Admin updated successfully");
    } else {
      updated = [
        ...users.admins,
        { ...form, id: Date.now() },
      ];
      setToast("✅ Admin added successfully");
    }

    users.admins = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setAdmins(updated);
    setForm(emptyAdmin);
    setEditing(false);

    setTimeout(() => setToast(""), 2500);
  };

  /* ================= DELETE ================= */
  const deleteAdmin = () => {
    const users = JSON.parse(localStorage.getItem("users"));

    const updated = users.admins.filter(
      (a) => a.id !== confirmId
    );

    users.admins = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setAdmins(updated);
    setConfirmId(null);
    setToast("🗑️ Admin deleted");

    setTimeout(() => setToast(""), 2500);
  };

  /* ================= EDIT ================= */
  const startEdit = (admin) => {
    setForm(admin);
    setEditing(true);
  };

  return (
    <div className="max-w-5xl space-y-8 text-gray-800">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold">Admins</h2>
        <p className="text-sm text-gray-600">
          Manage system administrators
        </p>
      </div>

      {/* ================= FORM ================= */}
      <GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Admin Name"
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
        </div>

        <button
          onClick={saveAdmin}
          className="
            mt-4 flex items-center gap-2
            px-6 py-2.5 rounded-full
            bg-purple-600 hover:bg-purple-700
            text-white font-semibold shadow
          "
        >
          <FaPlus />
          {editing ? "Update Admin" : "Add Admin"}
        </button>
      </GlassCard>

      {/* ================= LIST ================= */}
      <div className="grid gap-4">
        {admins.map((a) => (
          <GlassCard key={a.id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{a.name}</h3>
                <p className="text-sm text-gray-600">{a.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(a)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmId(a.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ================= DELETE CONFIRM ================= */}
      {confirmId && (
        <ConfirmModal
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteAdmin}
        />
      )}

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

/* ================= MODAL ================= */

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-80 space-y-4 shadow-xl">
      <h3 className="font-semibold text-lg">
        Delete Admin?
      </h3>
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

/* ================= GLASS ================= */

const GlassCard = ({ children }) => (
  <div className="bg-white/40 backdrop-blur-[24px] border border-white/40 rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
    {children}
  </div>
);
