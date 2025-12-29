import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
  FaSave,
  FaCheckCircle,
  FaCamera,
} from "react-icons/fa";

/* =====================================================
   STUDENT PROFILE – PREMIUM WITH VALIDATION
===================================================== */

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    batch: "",
    avatar: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  /* ⭐ NEW — Validation Errors */
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

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
        avatar: user.avatar || "",
      });
    } catch {}
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setMessage("");

    // Remove error while typing
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  /* ⭐ VALIDATION LOGIC */
  const validate = () => {
    let valid = true;
    let e = { name: "", phone: "" };

    if (!profile.name.trim()) {
      e.name = "Full name is required";
      valid = false;
    }

    if (!profile.phone.trim()) {
      e.phone = "Phone number is required";
      valid = false;
    } else if (!/^[0-9]{10}$/.test(profile.phone)) {
      e.phone = "Phone number must be 10 digits";
      valid = false;
    }

    setErrors(e);
    return valid;
  };

  const handleSave = async () => {
    setMessage("");

    if (!validate()) return; // ❌ Stop save if invalid

    setSaving(true);

    try {
      await new Promise((res) => setTimeout(res, 1200));

      const user = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));

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

      {/* PROFILE BANNER */}
      <div className="bg-gradient-to-r from-indigo-500/80 to-purple-600/80 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-6">
          {/* AVATAR */}
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarPopup(true)}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md border-4 border-white flex items-center justify-center text-3xl font-bold shadow-xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="absolute bottom-0 right-0 bg-white text-indigo-700 p-2 rounded-full shadow-lg opacity-90 group-hover:scale-110 transition">
              <FaCamera />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="text-sm opacity-90">{profile.course} • {profile.batch}</p>
          </div>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/40 max-w-4xl">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Personal Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">

          {/* FULL NAME */}
          <Input
            icon={<FaUser />}
            label="Full Name"
            value={profile.name}
            onChange={(v) => handleChange("name", v)}
            error={errors.name}
          />

          {/* EMAIL */}
          <Input
            icon={<FaEnvelope />}
            label="Email"
            value={profile.email}
            disabled
            hint="Email cannot be changed"
          />

          {/* PHONE */}
          <Input
            icon={<FaPhoneAlt />}
            label="Phone Number"
            value={profile.phone}
            onChange={(v) => handleChange("phone", v)}
            error={errors.phone}
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
            <p className="flex items-center gap-2 text-sm text-emerald-600 animate-fadeIn">
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
              shadow-md hover:shadow-xl transition
              disabled:opacity-60
            "
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* AVATAR MODAL */}
      {showAvatarPopup && (
        <AvatarModal
          profile={profile}
          setProfile={setProfile}
          onClose={() => setShowAvatarPopup(false)}
        />
      )}
    </div>
  );
}

/* =====================================================
   INPUT COMPONENT (ENHANCED WITH VALIDATION)
===================================================== */

const Input = ({
  label,
  value,
  onChange,
  icon,
  disabled = false,
  hint,
  error,
}) => (
  <div className="group">
    <label className="text-xs font-medium text-slate-600 mb-1 block">
      {label}
    </label>

    <div className="relative">
      {icon && (
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${
            error ? "text-red-500" : "text-slate-400 group-hover:text-indigo-500"
          }`}
        >
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
          ${error ? "border-red-400 focus:ring-red-300" : "border-slate-200 focus:ring-indigo-400/40"}
          focus:outline-none focus:ring-2
          shadow-sm hover:shadow transition
          disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
        `}
      />
    </div>

    {/* Validation error */}
    {error && (
      <p className="text-xs text-red-500 mt-1 animate-fadeIn">
        {error}
      </p>
    )}

    {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

/* =====================================================
   AVATAR MODAL (UNCHANGED)
===================================================== */

const AvatarModal = ({ profile, setProfile, onClose }) => {
  const [temp, setTemp] = useState(profile.avatar || "");

  const saveAvatar = () => {
    setProfile((p) => ({ ...p, avatar: temp }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-80 space-y-4">

        <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">
          Update Profile Picture
        </h3>

        <div className="flex justify-center">
          {temp ? (
            <img
              src={temp}
              className="w-28 h-28 rounded-full border shadow-md object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Paste image URL"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          className="w-full border rounded-xl px-4 py-2 bg-slate-50 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={saveAvatar}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};
