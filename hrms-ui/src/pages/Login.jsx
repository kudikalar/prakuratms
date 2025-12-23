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
import illustration from "../assets/hrms-illustration.png";

/* ================= ROLE THEMES ================= */
const roleConfig = {
  Student: {
    text: "text-purple-600",
    ring: "focus:ring-purple-400",
    btn: "from-purple-500 to-indigo-600",
    glow: "ring-purple-400/60",
    redirect: "/student/dashboard",
  },
  Educator: {
    text: "text-blue-600",
    ring: "focus:ring-blue-400",
    btn: "from-blue-500 to-cyan-500",
    glow: "ring-blue-400/60",
    redirect: "/educator/dashboard",
  },
  Admin: {
    text: "text-fuchsia-600",
    ring: "focus:ring-fuchsia-400",
    btn: "from-fuchsia-500 to-purple-600",
    glow: "ring-fuchsia-400/60",
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

  /* ✅ ADDED (ONLY ADDITION) */
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    terms: "",
  });

  const [forgotOpen, setForgotOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const theme = roleConfig[role];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const saved = localStorage.getItem("loginRole");
    if (saved && roleConfig[saved]) setRole(saved);
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  /* ================= SINGLE VALIDATION ================= */
  const validate = () => {
    let valid = true;
    let errors = { email: "", password: "", terms: "" };

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email address";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    }

    if (!acceptedTerms) {
      errors.terms = "Please accept the Terms of Service and Privacy Policy";
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
      setTimeout(() => window.location.replace(theme.redirect), 1500);
    } catch {
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eef1ff] relative overflow-hidden">
      {/* ================= HEADER ================= */}
      <header className="relative z-20 flex justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-6xl flex flex-col items-center gap-4 px-6 py-4 rounded-3xl bg-white shadow-md">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-9 h-9 sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-xl font-semibold text-slate-700 tracking-wide">
              <span className="font-bold text-purple-600">TMS</span>{" "}
              <span className="text-slate-700">Prakura IT Solutions</span>
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
            {[
              { label: "Home", icon: <FaHome />, href: "/" },
              { label: "About", icon: <FaInfoCircle />, href: "/about" },
              { label: "Courses", icon: <FaBookOpen />, href: "/courses" },
              { label: "Contact", icon: <FaPhoneAlt />, href: "/contact" },
              { label: "Support", icon: <FaLifeRing />, href: "/support" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                <span className="text-purple-500">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[28px] shadow-[0_40px_120px_rgba(80,70,200,0.25)] overflow-hidden">
          {/* LEFT */}
          <div className="px-6 sm:px-10 py-10 sm:py-14 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              Hello!
            </h1>
            <p className="text-slate-500 mb-8">Sign in to your account</p>

            {/* ROLE TOGGLE */}
            <div className="flex flex-wrap gap-3 mb-6">
              {roles.map((r) => {
                const active = role === r.name;
                return (
                  <button
                    key={r.name}
                    onClick={() => setRole(r.name)}
                    className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition ${
                      active
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {r.icon}
                    {r.name}
                  </button>
                );
              })}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                icon={<FaEnvelope />}
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setFieldErrors((e) => ({ ...e, email: "" }));
                }}
                placeholder="E-mail"
                ring={theme.ring}
              />
              {fieldErrors.email && (
                <p className="ml-4 text-xs text-red-500">
                  {fieldErrors.email}
                </p>
              )}

              <GlassInput
                icon={<FaLock />}
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setFieldErrors((e) => ({ ...e, password: "" }));
                }}
                placeholder="Password"
                ring={theme.ring}
                type={showPassword ? "text" : "password"}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
              />
              {fieldErrors.password && (
                <p className="ml-4 text-xs text-red-500">
                  {fieldErrors.password}
                </p>
              )}

              <div className="flex justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      setFieldErrors((er) => ({ ...er, terms: "" }));
                    }}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <label className="flex gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    setFieldErrors((er) => ({ ...er, terms: "" }));
                  }}
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="underline text-purple-600"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="underline text-purple-600"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="ml-4 text-xs text-red-500">
                  {fieldErrors.terms}
                </p>
              )}

              <button
                disabled={loading}
                className={`w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r ${theme.btn}
                flex items-center justify-center gap-2 transition hover:scale-[1.02] shadow-lg`}
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Signing in…" : "SIGN IN"}
              </button>
            </form>

            {/* SSO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button className="flex items-center justify-center gap-2 py-2 rounded-full bg-slate-100 hover:bg-slate-200">
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-full bg-slate-100 hover:bg-slate-200">
                <FaMicrosoft className="text-blue-500" /> Microsoft
              </button>
            </div>

            <div className="mt-4 text-xs flex justify-center gap-2 text-slate-500">
              <FaShieldAlt className={theme.text} />
              Enterprise-grade security
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]" />
            <img src={illustration} className="relative max-w-[80%]" />
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center text-slate-500 space-y-4">
        <div className="flex justify-center gap-6 sm:gap-8 text-xl sm:text-2xl">
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

/* ================= HELPERS (UNCHANGED) ================= */

function GlassInput({ icon, value, onChange, placeholder, ring, type = "text", right }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-14 pr-10 py-3 rounded-full border border-slate-200 text-slate-700 placeholder-slate-400 focus:ring-2 ${ring}`}
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
  const brandClass =
    url.includes("linkedin")
      ? "bg-[#0A66C2] text-white"
      : url.includes("instagram")
      ? "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white"
      : url.includes("facebook")
      ? "bg-[#1877F2] text-white"
      : url.includes("youtube")
      ? "bg-[#FF0000] text-white"
      : url.includes("wa.me")
      ? "bg-[#25D366] text-white"
      : "bg-slate-200 text-slate-700";

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md
      ${brandClass}
      hover:scale-125 hover:shadow-xl transition-transform duration-300`}
    >
      {icon}
    </a>
  );
}

function Toast({ type, message }) {
  return (
    <div
      className={`fixed top-6 right-6 px-5 py-3 rounded-xl text-white shadow-lg ${
        type === "success" ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}

function LegalModal({ title, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl relative text-slate-700">
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

function ForgotModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const send = () => {
    if (!email) return setMsg("Email is required");
    setMsg("Reset link sent successfully");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative text-slate-700">
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
        <button
          onClick={send}
          className="w-full py-2 bg-indigo-600 text-white rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
