import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Toast from "../../../components/Toast";

/* ================= HELPERS ================= */

const STORAGE_KEY = "users";

const emptyAdmin = {
  id: null,
  name: "",
  email: "",
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const loadUsers = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      admins: Array.isArray(raw?.admins) ? raw.admins : [],
      educators: Array.isArray(raw?.educators) ? raw.educators : [],
      students: Array.isArray(raw?.students) ? raw.students : [],
    };
  } catch {
    return { admins: [], educators: [], students: [] };
  }
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

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
    const users = loadUsers();
    setAdmins(users.admins);
  }, []);

  /* ================= VALIDATION ================= */
  const validate = (data = form) => {
    const e = {};

    if (!data.name.trim()) {
      e.name = "Admin name is required";
    } else if (data.name.trim().length < 3) {
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

    const users = loadUsers();
    let updatedAdmins;

    if (editing) {
      updatedAdmins = users.admins.map((a) =>
        a.id === form.id
          ? {
              ...a,
              name: form.name.trim(),
              email: form.email.trim().toLowerCase(),
            }
          : a
      );
      setToast({ show: true, message: "✅ Admin updated successfully" });
    } else {
      updatedAdmins = [
        ...users.admins,
        {
          id: Date.now(),
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          role: "Admin",
          createdAt: new Date().toISOString(),
        },
      ];
      setToast({ show: true, message: "✅ Admin added successfully" });
    }

    const updatedUsers = { ...users, admins: updatedAdmins };
    saveUsers(updatedUsers);
    setAdmins(updatedAdmins);
    resetForm();

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  /* ================= DELETE ================= */
  const deleteAdmin = () => {
    const users = loadUsers();
    const updated = users.admins.filter((a) => a.id !== confirmId);

    saveUsers({ ...users, admins: updated });
    setAdmins(updated);
    setConfirmId(null);

    setToast({ show: true, message: "🗑️ Admin deleted" });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  };

  /* ================= EDIT ================= */
  const startEdit = (admin) => {
    setForm({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });
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
        max-w-5xl mx-auto space-y-10 animate-fadeIn
        bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100
        rounded-[36px] p-5 sm:p-6 md:p-8
        shadow-[0_45px_150px_rgba(79,70,229,0.35)]
        border border-white/50
      "
    >
      {/* HEADER */}
      <div>
        <h2
          className="
            text-2xl md:text-3xl font-bold
            bg-gradient-to-r from-indigo-700 to-violet-700
            bg-clip-text text-transparent
          "
        >
          Admins
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Manage system administrators
        </p>
      </div>

      {/* FORM */}
      <GlassCard>
        <div className="grid md:grid-cols-2 gap-4">
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
              className="
                glass-input
                focus:ring-2 focus:ring-indigo-500/60
                transition
              "
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
            )}
          </div>

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
              className="
                glass-input
                focus:ring-2 focus:ring-indigo-500/60
                transition
              "
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={saveAdmin}
            className="
              flex items-center gap-2 px-7 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
              hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700
              shadow-[0_18px_50px_rgba(79,70,229,0.5)]
              hover:scale-[1.03]
              transition
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
                bg-white/80 border border-white/60
                text-slate-700 flex items-center gap-2
                hover:bg-white transition
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
          <GlassCard
            key={a.id}
            className="
              hover:-translate-y-[1px]
              hover:shadow-[0_35px_110px_rgba(79,70,229,0.35)]
              transition
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-800">{a.name}</h3>
                <p className="text-sm text-slate-600">{a.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(a)}
                  className="
                    p-2.5 rounded-full
                    bg-indigo-100/80 text-indigo-700
                    hover:bg-indigo-200 hover:scale-110
                    transition
                  "
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setConfirmId(a.id)}
                  className="
                    p-2.5 rounded-full
                    bg-rose-100/80 text-rose-700
                    hover:bg-rose-200 hover:scale-110
                    transition
                  "
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

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
        className="z-[60]"
      />
    </div>
  );
}

/* ================= UI HELPERS ================= */

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/65 backdrop-blur-2xl
      border border-white/60 rounded-3xl p-6
      shadow-[0_30px_90px_rgba(79,70,229,0.25)]
      transition
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
    <div className="
      relative glass-card w-80
      bg-white/90 backdrop-blur-2xl
      rounded-3xl p-6
      border border-white/60
      shadow-[0_35px_120px_rgba(0,0,0,0.35)]
      animate-scaleIn
    ">
      <h3 className="font-semibold text-lg text-slate-800">
        Delete Admin?
      </h3>
      <p className="text-sm text-slate-600 mt-1">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/70 border border-white/60"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
