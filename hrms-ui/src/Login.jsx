import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";

import logo from "../assets/prakura-logo.png";
import illustration from "../assets/login-illustration.png";

/* ================= ROLE THEMES ================= */
const roleConfig = {
  Student: {
    gradient: "from-orange-500 to-yellow-400",
    text: "text-orange-600",
    ring: "focus:ring-orange-400",
    redirect: "/student/dashboard",
  },
  Educator: {
    gradient: "from-blue-500 to-cyan-400",
    text: "text-blue-600",
    ring: "focus:ring-blue-400",
    redirect: "/educator/dashboard",
  },
  Admin: {
    gradient: "from-purple-600 to-pink-500",
    text: "text-purple-600",
    ring: "focus:ring-purple-400",
    redirect: "/admin/dashboard",
  },
};

const roles = [
  { name: "Student", icon: <FaUserGraduate /> },
  { name: "Educator", icon: <FaChalkboardTeacher /> },
  { name: "Admin", icon: <FaUserShield /> },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    terms: "",
  });

  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const theme = roleConfig[role];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ================= FORCE HASH MODE ================= */
  useEffect(() => {
    if (!window.location.hash) {
      window.location.replace("/#/login");
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("loginRole");
    if (saved && roleConfig[saved]) setRole(saved);
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    let valid = true;
    let errors = { email: "", password: "", terms: "" };

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    }

    if (!acceptedTerms) {
      errors.terms = "Please accept Terms & Privacy Policy";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loginRole", role);

      showToast("success", "Login successful. Redirecting...");
      setTimeout(() => {
        window.location.replace(`/#${theme.redirect}`);
      }, 1500);
    } catch {
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden
      bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-300">

      {/* Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl" />

      {/* Glass Card */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden
        bg-white/40 backdrop-blur-2xl border border-white/40
        shadow-[0_30px_90px_rgba(0,0,0,0.2)]">

        {/* LEFT */}
        <div className="p-10 flex flex-col justify-center">

          {/* Brand */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} className="w-20 h-20 mb-2" alt="logo" />
            <h1 className={`text-2xl font-bold ${theme.text}`}>
              Prakura IT Solutions
            </h1>
            <p className="text-xs tracking-widest text-gray-600">
              TRAINING MANAGEMENT SYSTEM
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-white/60 rounded-full p-1 shadow-inner">
              {roles.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setRole(r.name)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all
                    ${
                      role === r.name
                        ? `bg-gradient-to-r ${theme.gradient} text-white scale-105`
                        : "text-gray-500 hover:bg-white/50"
                    }`}
                >
                  {r.icon}
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <div className="relative">
                <FaEnvelope className={`absolute left-4 top-3.5 ${theme.text}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((er) => ({ ...er, email: "" }));
                  }}
                  placeholder="Email"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-full
                    bg-white/70 border border-white/50 shadow-inner
                    focus:ring-2 ${theme.ring} outline-none`}
                />
              </div>
              {fieldErrors.email && (
                <p className="ml-4 mt-1 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <FaLock className={`absolute left-4 top-3.5 ${theme.text}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((er) => ({ ...er, password: "" }));
                  }}
                  placeholder="Password"
                  className={`w-full pl-11 pr-12 py-2.5 rounded-full
                    bg-white/70 border border-white/50 shadow-inner
                    focus:ring-2 ${theme.ring} outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="ml-4 mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex gap-2 text-xs text-gray-600 px-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  setFieldErrors((er) => ({ ...er, terms: "" }));
                }}
              />
              Accept Terms & Privacy Policy
            </label>

            {fieldErrors.terms && (
              <p className="ml-4 text-xs text-red-600">
                {fieldErrors.terms}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-semibold text-white
                bg-gradient-to-r ${theme.gradient}
                shadow-lg transition-all`}
            >
              {loading ? "Signing in..." : `Sign in as ${role}`}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <FaShieldAlt className={`inline ${theme.text}`} /> Secure role-based login
            <p>© {new Date().getFullYear()} Prakura IT Solutions</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center relative">
          <img src={illustration} className="w-4/5 drop-shadow-2xl" alt="illustration" />
        </div>
      </div>

      {toast && <Toast {...toast} />}
      {termsOpen && <LegalModal title="Terms of Service" onClose={() => setTermsOpen(false)} />}
      {privacyOpen && <LegalModal title="Privacy Policy" onClose={() => setPrivacyOpen(false)} />}
    </div>
  );
}

/* ================= HELPERS ================= */

function Toast({ type, message }) {
  return (
    <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl text-white shadow-lg
      ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
      {message}
    </div>
  );
}

function LegalModal({ title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative text-slate-700">
        <button onClick={onClose} className="absolute top-3 right-3">
          <FaTimes />
        </button>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm leading-relaxed">
          Prakura IT Solutions platform usage policy and privacy compliance.
        </p>
      </div>
    </div>
  );
}
