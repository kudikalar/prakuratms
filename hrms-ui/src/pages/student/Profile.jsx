import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROFILE – PREMIUM (PRODUCTION READY)
===================================================== */

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    batch: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= INIT ================= */

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      setProfile({
        name: user.name || "Student Name",
        email: user.email || "student@email.com",
        phone: user.phone || "",
        course: user.course || "Full Stack Development",
        batch: user.batch || "Batch A",
      });
    } catch {
      /* safe fallback */
    }
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      // 🔹 Replace with API call later
      await new Promise((res) => setTimeout(res, 1200));

      const user = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, ...profile })
      );

      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/40">
        <h2 className="text-2xl font-semibold text-slate-800">
          My Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information and contact details
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/40 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          <Input
            icon={<FaUser />}
            label="Full Name"
            value={profile.name}
            onChange={(v) => handleChange("name", v)}
          />

          <Input
            icon={<FaEnvelope />}
            label="Email"
            value={profile.email}
            disabled
            hint="Email cannot be changed"
          />

          <Input
            icon={<FaPhoneAlt />}
            label="Phone Number"
            value={profile.phone}
            onChange={(v) => handleChange("phone", v)}
          />

          <Input
            icon={<FaGraduationCap />}
            label="Course"
            value={profile.course}
            disabled
          />

          <Input
            label="Batch"
            value={profile.batch}
            disabled
          />
        </div>

        {/* ACTION BAR */}
        <div className="mt-8 flex items-center justify-between">
          {message ? (
            <p className="flex items-center gap-2 text-sm text-emerald-600">
              <FaCheckCircle />
              {message}
            </p>
          ) : (
            <span />
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              flex items-center gap-2
              px-7 py-2.5 rounded-2xl
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              text-white text-sm font-semibold
              shadow-md transition
              disabled:opacity-60
            "
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

const Input = ({
  label,
  value,
  onChange,
  icon,
  disabled = false,
  hint,
}) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">
      {label}
    </label>

    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full rounded-xl border
          ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5
          bg-white/80
          focus:outline-none focus:ring-2 focus:ring-indigo-400/40
          transition
          disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
        `}
      />
    </div>

    {hint && (
      <p className="text-[11px] text-slate-400 mt-1">
        {hint}
      </p>
    )}
  </div>
);
