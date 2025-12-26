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
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaHome,
  FaInfoCircle,
  FaBookOpen,
  FaPhoneAlt,
  FaLifeRing,
  FaGoogle,
  FaMicrosoft,
} from "react-icons/fa";

import logo from "../assets/prakura-logo.png";

/* ================= ROLE CONFIG ================= */
const roles = [
  { name: "Student", icon: <FaUserGraduate /> },
  { name: "Educator", icon: <FaChalkboardTeacher /> },
  { name: "Admin", icon: <FaUserShield /> },
];

const roleContent = {
  Student: {
    title: "Unlock Your Learning Potential",
    desc:
      "Build skills, track progress, and prepare for real-world careers with industry-ready training.",
    redirect: "/student/dashboard",
  },
  Educator: {
    title: "Shape the Future of Learning",
    desc:
      "Manage courses, mentor students, and deliver impactful learning experiences.",
    redirect: "/educator/dashboard",
  },
  Admin: {
    title: "Secure Platform Administration",
    desc:
      "Monitor, manage, and secure institutional operations with full control.",
    redirect: "/admin/dashboard",
  },
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    terms: "",
  });

  const [forgotOpen, setForgotOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("loginRole");
    if (saved && roleContent[saved]) setRole(saved);
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    let errors = { email: "", password: "", terms: "" };
    let valid = true;

    if (!email) {
      errors.email = "Email is required";
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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok) {
        showToast("error", data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loginRole", role);
      if (rememberMe) localStorage.setItem("rememberMe", "true");

      showToast("success", "Login successful. Redirecting...");
      setTimeout(() => {
        window.location.replace(`/#${roleContent[role].redirect}`);
      }, 1500);
    } catch {
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="flex justify-center px-4 py-5">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow flex flex-col items-center gap-4 p-4">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" />
            <span className="text-lg font-semibold">
              <span className="text-blue-600 font-bold">TMS</span>{" "}
              Prakura IT Solutions
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px]
        shadow-[0_60px_160px_rgba(30,58,138,0.35)] overflow-hidden">

          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-center px-16 relative text-white
          bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 overflow-hidden">

            <div className="absolute inset-0 opacity-30 animate-wave
            bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35)_1px,transparent_1px)]
            [background-size:22px_22px]" />

            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

            <div className="relative z-10 max-w-md">
              <img src={logo} className="w-14 h-14 mb-8" />

              <h2 className="text-4xl font-bold mb-4">
                {roleContent[role].title}
              </h2>

              <p className="text-blue-100 text-sm leading-relaxed">
                {roleContent[role].desc}
              </p>

              <div className="mt-10 text-xs tracking-wider text-blue-200">
                Learn • Build • Get Placed
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white/80 backdrop-blur-xl px-10 sm:px-14 py-14">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
              Welcome 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mb-10">
              Let’s login to your account
            </p>

            {/* ROLE PILLS */}
            <div className="flex gap-4 mb-8 flex-wrap">
              {roles.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setRole(r.name)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold transition-all
                  ${
                    role === r.name
                      ? "bg-blue-600 text-white shadow-lg scale-[1.05]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-lg">{r.icon}</span>
                  {r.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                icon={<FaEnvelope />}
                value={email}
                onChange={setEmail}
                placeholder="Email address"
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              )}

              <GlassInput
                icon={<FaLock />}
                value={password}
                onChange={setPassword}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                right={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500">{fieldErrors.password}</p>
              )}

              <div className="flex justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  Remember me
                </label>
                <button type="button" onClick={() => setForgotOpen(true)} className="text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <label className="flex gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                I agree to Terms & Privacy Policy
              </label>
              {fieldErrors.terms && (
                <p className="text-xs text-red-500">{fieldErrors.terms}</p>
              )}

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Signing in…" : "Login"}
              </button>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="flex items-center justify-center gap-2 py-2 border rounded-lg">
                  <FaGoogle /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2 border rounded-lg">
                  <FaMicrosoft /> Microsoft
                </button>
              </div>

              <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-400">
                <FaShieldAlt /> Enterprise-grade security
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-slate-500">
        <div className="flex justify-center gap-6 text-xl mb-2">
          <Social icon={<FaLinkedin />} url="https://www.linkedin.com/company/prakuraitsolutions" />
          <Social icon={<FaInstagram />} url="https://www.instagram.com/prakuraitsolutions" />
          <Social icon={<FaFacebook />} url="https://www.facebook.com/prakuraitsolutions" />
          <Social icon={<FaYoutube />} url="https://www.youtube.com/@prakuraitsolutions" />
          <Social icon={<FaWhatsapp />} url="https://wa.me/919999999999" />
        </div>
        © {new Date().getFullYear()} Prakura IT Solutions
      </footer>

      {toast && <Toast {...toast} />}
      {termsOpen && <LegalModal title="Terms of Service" onClose={() => setTermsOpen(false)} />}
      {privacyOpen && <LegalModal title="Privacy Policy" onClose={() => setPrivacyOpen(false)} />}
      {forgotOpen && <ForgotModal onClose={() => setForgotOpen(false)} />}
    </div>
  );
}

/* ================= HELPERS ================= */

function GlassInput({ icon, value, onChange, placeholder, type = "text", right }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200
        bg-white text-slate-800 placeholder-slate-400
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {right && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          {right}
        </span>
      )}
    </div>
  );
}

function Social({ icon, url }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="hover:scale-125 transition">
      {icon}
    </a>
  );
}

function Toast({ type, message }) {
  return (
    <div className={`fixed top-6 right-6 px-4 py-3 rounded-xl text-white ${
      type === "success" ? "bg-emerald-500" : "bg-red-500"
    }`}>
      {message}
    </div>
  );
}

function LegalModal({ title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white rounded-xl p-6 max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <FaTimes />
        </button>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm">Prakura IT Solutions policy details.</p>
      </div>
    </div>
  );
}

function ForgotModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const send = () => {
    if (!email) return setMsg("Email is required");
    setMsg("Reset link sent successfully");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white rounded-xl p-6 max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <FaTimes />
        </button>
        <h3 className="text-lg font-semibold mb-3">Reset Password</h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Registered email"
          className="w-full px-4 py-2 border rounded mb-2"
        />
        {msg && <p className="text-xs text-emerald-600 mb-2">{msg}</p>}
        <button onClick={send} className="w-full py-2 bg-blue-600 text-white rounded">
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
