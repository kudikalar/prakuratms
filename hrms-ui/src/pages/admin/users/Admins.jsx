import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Toast from "../../../components/Toast";

/* ================= HELPERS ================= */

const emptyAdmin = {
  id: null,
  name: "",
  email: "",
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= COMPONENT ================= */

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyAdmin);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmId, setConfirmId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };
    setAdmins(users.admins || []);
  }, []);

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};

    if (!data.name.trim()) {
      e.name = "Admin name is required";
    } else if (data.name.length < 3) {
      e.name = "Name must be at least 3 characters";
    }

    if (!data.email.trim()) {
      e.email = "Email address is required";
    } else if (!isValidEmail(data.email)) {
      e.email = "Enter a valid email address";
    } else {
      const exists = admins.some(
        (a) =>
          a.email.toLowerCase() === data.email.toLowerCase() &&
          a.id !== data.id
      );
      if (exists) e.email = "Email already exists";
    }

    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [form]);

  /* ================= SAVE ================= */
  const saveAdmin = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true });

    if (Object.keys(validationErrors).length > 0) return;

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
      setToast({ show: true, message: "✅ Admin updated successfully" });
    } else {
      updated = [...users.admins, { ...form, id: Date.now() }];
      setToast({ show: true, message: "✅ Admin added successfully" });
    }

    users.admins = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setAdmins(updated);
    resetForm();

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  /* ================= DELETE ================= */
  const deleteAdmin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {
      admins: [],
      educators: [],
      students: [],
    };

    const updated = users.admins.filter((a) => a.id !== confirmId);
    users.admins = updated;

    localStorage.setItem("users", JSON.stringify(users));
    setAdmins(updated);
    setConfirmId(null);

    setToast({ show: true, message: "🗑️ Admin deleted" });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  /* ================= EDIT ================= */
  const startEdit = (admin) => {
    setForm(admin);
    setEditing(true);
    setErrors({});
    setTouched({});
  };

  const resetForm = () => {
    setForm(emptyAdmin);
    setEditing(false);
    setErrors({});
    setTouched({});
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        max-w-5xl space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Admins</h2>
        <p className="text-sm text-slate-600">
          Manage system administrators
        </p>
      </div>

      {/* FORM */}
      <GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
          {/* NAME */}
          <div>
            <input
              placeholder="Admin Name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setTouched((t) => ({ ...t, name: true }));
              }}
              onBlur={() =>
                setTouched((t) => ({ ...t, name: true }))
              }
              className="glass-input"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setTouched((t) => ({ ...t, email: true }));
              }}
              onBlur={() =>
                setTouched((t) => ({ ...t, email: true }))
              }
              className="glass-input"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={saveAdmin}
            className="
              flex items-center gap-2 px-7 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              shadow-lg transition
            "
          >
            <FaPlus />
            {editing ? "Update Admin" : "Add Admin"}
          </button>

          {editing && (
            <button
              onClick={resetForm}
              className="
                px-6 py-3 rounded-full
                bg-white/70 border border-white/50
                text-slate-700 flex items-center gap-2
              "
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>
      </GlassCard>

      {/* LIST */}
      <div className="grid gap-4">
        {admins.map((a) => (
          <GlassCard key={a.id} className="glass-hover">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {a.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {a.email}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(a)}
                  className="
                    p-2.5 rounded-full
                    bg-indigo-100 text-indigo-600
                    hover:bg-indigo-200 transition
                  "
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmId(a.id)}
                  className="
                    p-2.5 rounded-full
                    bg-rose-100 text-rose-600
                    hover:bg-rose-200 transition
                  "
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* DELETE CONFIRM */}
      {confirmId && (
        <ConfirmModal
          onCancel={() => setConfirmId(null)}
          onConfirm={deleteAdmin}
        />
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

/* ================= MODALS & UI ================= */

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/40 backdrop-blur-[24px]
      border border-white/40 rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
      ${className}`}
  >
    {children}
  </div>
);

const ConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="relative glass-card w-80 animate-scaleIn">
      <h3 className="font-semibold text-lg text-slate-800">
        Delete Admin?
      </h3>
      <p className="text-sm text-slate-600 mt-1">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg
          bg-white/60 border border-white/50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg
          bg-red-600 hover:bg-red-700
          text-white font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
