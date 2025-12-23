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

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyAdmin);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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

  const isFormValid = Object.keys(errors).length === 0;

  /* ================= SAVE ================= */
  const saveAdmin = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true });

    if (Object.keys(validationErrors).length > 0) {
      setToast("❌ Please fix validation errors");
      return;
    }

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
      updated = [...users.admins, { ...form, id: Date.now() }];
      setToast("✅ Admin added successfully");
    }

    users.admins = updated;
    localStorage.setItem("users", JSON.stringify(users));

    setAdmins(updated);
    resetForm();

    setTimeout(() => setToast(""), 2500);
  };

  /* ================= DELETE ================= */
  const deleteAdmin = () => {
    const users = JSON.parse(localStorage.getItem("users"));
    const updated = users.admins.filter((a) => a.id !== confirmId);

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
          {/* NAME */}
          <div>
            <input
              placeholder="Admin Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, name: true })}
              className={`p-3 w-full rounded-xl bg-white/70 border
                ${errors.name && touched.name
                  ? "border-red-400"
                  : "border-gray-200"}`}
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
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, email: true })}
              className={`p-3 w-full rounded-xl bg-white/70 border
                ${errors.email && touched.email
                  ? "border-red-400"
                  : "border-gray-200"}`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
  onClick={saveAdmin}
  className="
    flex items-center gap-2 px-6 py-2.5 rounded-full
    font-semibold shadow
    bg-purple-600 hover:bg-purple-700 text-white
  "
>
  <FaPlus />
  {editing ? "Update Admin" : "Add Admin"}
</button>


          {editing && (
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 flex items-center gap-2"
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>
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
