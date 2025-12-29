/* ==================================================================================
   PRAKURA TMS – FINAL PRODUCTION READY LOGIN PAGE
   ✔ Forgot Password Modal (working)
   ✔ Terms & Privacy Modal (300+ words)
   ✔ Social Media Footer (official brand colors + username)
   ✔ Multi-colored role buttons
   ✔ Centered premium header
   ✔ Purple corporate theme
   ✔ Full glassmorphism layout
   ✔ NO CONTENT REMOVED
================================================================================== */

import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaLinkedin,
} from "react-icons/fa";

import logo from "../assets/prakura-logo.png";
import { APP_BASE } from "../utils/basePath";

/* ================= ROLE CONFIG ================= */

const roles = [
  { name: "Student", color: "emerald", icon: <FaUserGraduate /> },
  { name: "Educator", color: "blue", icon: <FaChalkboardTeacher /> },
  { name: "Admin", color: "purple", icon: <FaUserShield /> },
];
const roleContent = {
  Student: {
    title: "Unlock Your Learning Potential",
    desc: "Build skills, track progress, and prepare for real-world careers with industry-ready training.",
    redirect: "/student/dashboard",
  },
  Educator: {
    title: "Shape the Future of Learning",
    desc: "Manage courses, mentor students, and deliver impactful learning experiences.",
    redirect: "/educator/dashboard", // ✅ FIXED
  },
  Admin: {
    title: "Secure Platform Administration",
    desc: "Monitor, manage, and secure institutional operations with full control.",
    redirect: "/admin/dashboard",
  },
};


/* ================= ENV ================= */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROLE_ENDPOINT = {
  Student: "student",
  Educator: "educator",
  Admin: "admin",
};

/* ===================================================================
   MAIN LOGIN COMPONENT
=================================================================== */

export default function Login() {
  /* FORM STATES */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  /* MODALS */
  const [forgotOpen, setForgotOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const [resetStage, setResetStage] = useState("EMAIL");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ERRORS */
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    terms: "",
  });

  /* LOAD LAST ROLE */
  useEffect(() => {
    const savedRole = localStorage.getItem("loginRole");
    if (savedRole && roleContent[savedRole]) setRole(savedRole);
  }, []);

  /* TOAST HELPER */
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const normalizeRole = (r) => r?.toUpperCase();

  /* VALIDATION */

  const validate = () => {
    let valid = true;
    const e = { email: "", password: "", terms: "" };

    if (!email) (e.email = "Email is required"), (valid = false);
    if (!password) (e.password = "Password is required"), (valid = false);
    if (!acceptedTerms)
      (e.terms = "Please accept Terms & Privacy Policy"), (valid = false);

    setErrors(e);
    return valid;
  };

  /* ================= LOGIN ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const endpoint = ROLE_ENDPOINT[role];

      const res = await fetch(`${API_URL}/api/auth/${endpoint}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Invalid credentials");
        return;
      }

      const normalizedUser = { ...data.user, role: normalizeRole(role) };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("loginRole", role);

      if (rememberMe) localStorage.setItem("rememberMe", "true");

      showToast("success", "Login successful");

      setTimeout(() => {
        window.location.replace(`${APP_BASE}/#${roleContent[role].redirect}`);
      }, 900);
    } catch {
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */

  const handleForgotPassword = async () => {
    if (!email) {
      showToast("error", "Enter your email first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: normalizeRole(role) }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Unable to send reset link");
        return;
      }

      showToast("success", "Reset link sent to email");
      setResetStage("RESET");
    } catch {
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      showToast("error", "All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Reset failed");
        return;
      }

      showToast("success", "Password reset successful");
      setForgotOpen(false);
      setResetStage("EMAIL");
      setResetToken("");
      setNewPassword("");
    } catch {
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================================
     RENDER UI
  ==================================================================== */

  return (
   <div className="min-h-screen bg-gradient-to-br from-purple-300/30 via-white to-purple-200/40 flex flex-col">

  {/* HEADER */}
  <header className="flex justify-center py-4">
    <div className="bg-white/60 px-6 py-2 rounded-xl backdrop-blur-xl border border-purple-300/40 shadow-lg flex flex-col items-center">
      
      <img src={logo} className="w-8 h-8 mb-1 drop-shadow" />

      <h1 className="text-lg font-bold text-slate-800 leading-tight">
        <span className="text-purple-700 font-extrabold">PRAKURA</span> TMS
      </h1>

      <p className="text-[11px] text-slate-500">
        Training Management System
      </p>

    </div>
  </header>



      {/* MAIN */}

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl overflow-hidden">

          {/* LEFT SECTION */}

          <div className="hidden lg:flex flex-col justify-center px-16 text-white bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900">
            <img src={logo} className="w-16 h-16 mb-8 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">{roleContent[role].title}</h2>
            <p className="text-purple-200 text-sm">{roleContent[role].desc}</p>
          </div>

          {/* RIGHT LOGIN SECTION */}

          <div className="px-10 py-14">

            <h1 className="text-3xl font-semibold text-slate-800 mb-2">Welcome 👋</h1>
            <p className="text-slate-500 mb-8">Login to your account</p>

            {/* ROLE BUTTONS */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {roles.map((r) => {
                const colors = {
                  emerald: "bg-emerald-600 text-white shadow-emerald-300",
                  blue: "bg-blue-600 text-white shadow-blue-300",
                  purple: "bg-purple-600 text-white shadow-purple-300",
                };

                const inactive = "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300";

                return (
                  <button
                    key={r.name}
                    onClick={() => setRole(r.name)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition
                    ${role === r.name ? colors[r.color] : inactive}`}
                  >
                    {r.icon}
                    {r.name}
                  </button>
                );
              })}
            </div>

            {/* LOGIN FORM */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <Input
                icon={<FaEnvelope />}
                value={email}
                onChange={setEmail}
                placeholder="Email address"
              />
              <ErrorText>{errors.email}</ErrorText>

              {/* PASSWORD */}
              <Input
                icon={<FaLock />}
                value={password}
                onChange={setPassword}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                right={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
              />
              <ErrorText>{errors.password}</ErrorText>

              {/* OPTIONS */}

              <div className="flex justify-between text-xs text-slate-600">
                <label className="flex gap-2">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  Remember me
                </label>

                <button type="button" onClick={() => setForgotOpen(true)} className="text-purple-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              {/* TERMS CHECKBOX */}

              <label className={`flex gap-2 text-xs ${errors.terms ? "text-red-500" : "text-slate-600"}`}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className={errors.terms ? "accent-red-500" : "accent-purple-600"}
                />
                <span>
                  I agree to{" "}
                  <button type="button" onClick={() => setTermsOpen(true)} className="text-purple-600 underline">
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button type="button" onClick={() => setTermsOpen(true)} className="text-purple-600 underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
              <ErrorText>{errors.terms}</ErrorText>

              {/* LOGIN BUTTON */}

              <button
                disabled={loading || !acceptedTerms}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition
                  ${
                    loading || !acceptedTerms
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 shadow-md"
                  }`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {forgotOpen && (
        <Modal title="Reset Password" onClose={() => setForgotOpen(false)}>
          {resetStage === "EMAIL" && (
            <div className="space-y-4">
              <Input icon={<FaEnvelope />} value={email} onChange={setEmail} placeholder="Enter your email" />
              <button
                onClick={handleForgotPassword}
                className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                Send Reset Link
              </button>
            </div>
          )}

          {resetStage === "RESET" && (
            <div className="space-y-4">
              <Input
                icon={<FaLock />}
                value={resetToken}
                onChange={setResetToken}
                placeholder="Enter reset token"
              />
              <Input
                icon={<FaLock />}
                value={newPassword}
                onChange={setNewPassword}
                placeholder="New password"
              />
              <button
                onClick={handleResetPassword}
                className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                Reset Password
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* TERMS & PRIVACY MODAL */}
      {termsOpen && (
        <Modal title="Terms & Privacy Policy" onClose={() => setTermsOpen(false)}>
          <div className="h-[360px] overflow-y-auto pr-2 text-slate-700 space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to Prakura IT Solutions Training Management System (TMS). By accessing or using our platform,
              you agree to comply with and be bound by the terms outlined in this document. Our TMS is designed to help
              students, educators, and administrators manage learning activities effectively, and we are committed to
              ensuring a secure, transparent, and ethical experience for every user.
            </p>

            <p>
              Your privacy is extremely important to us. We collect only necessary information required to create your
              learning account, process training activities, monitor progress, and improve our services. Personal
              information such as email, name, training logs, and role-based access details are stored securely. We do
              not sell or share your data with third parties except as required for delivering core platform features or
              to comply with legal requirements. All data interactions are encrypted and handled with strict
              confidentiality.
            </p>

            <p>
              By using our platform, you agree not to misuse, attempt to hack, manipulate content, or perform actions
              that may compromise platform stability or data privacy. Administrators reserve the right to suspend or
              restrict access if unusual or harmful activities are detected. You also agree to use the platform only for
              legal and authorized training purposes and acknowledge that all course materials, resources, and content
              published inside the TMS are the intellectual property of Prakura IT Solutions.
            </p>

            <p>
              Our privacy policy ensures that you maintain full control over your account, including the right to update
              personal information, request deletion of non-essential data, and control over communication preferences.
              We continuously update our security practices to align with industry standards, ensuring safety and trust
              at every step. By continuing, you accept these conditions and agree to abide by all policies for a safe
              and productive learning environment.
            </p>
          </div>
        </Modal>
      )}

    {/* FOOTER */}
<footer className="w-full py-3 flex flex-col items-center gap-3">
  <div className="flex gap-6 text-xl">
    <a
      href="https://facebook.com/prakuraitsolutions"
      target="_blank"
      className="text-[#1877F2] hover:scale-110 transition"
    >
      <FaFacebook />
    </a>
    <a
      href="https://instagram.com/prakuraitsolutions"
      target="_blank"
      className="text-[#E4405F] hover:scale-110 transition"
    >
      <FaInstagram />
    </a>
    <a
      href="https://youtube.com/prakuraitsolutions"
      target="_blank"
      className="text-[#FF0000] hover:scale-110 transition"
    >
      <FaYoutube />
    </a>
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      className="text-[#25D366] hover:scale-110 transition"
    >
      <FaWhatsapp />
    </a>
    <a
      href="https://linkedin.com/company/prakuraitsolutions"
      target="_blank"
      className="text-[#0A66C2] hover:scale-110 transition"
    >
      <FaLinkedin />
    </a>
  </div>

  <p className="text-xs text-slate-600">
    © {new Date().getFullYear()} Prakura IT Solutions — All rights reserved.
  </p>
</footer>


      {toast && <Toast {...toast} />}
    </div>
  );
}

/* ===================================================================
   SMALL COMPONENTS
=================================================================== */

function Input({ icon, value, onChange, placeholder, type = "text", right }) {
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
        className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-slate-200
        text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-purple-400 outline-none
        backdrop-blur-md"
      />

      {right && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          {right}
        </span>
      )}
    </div>
  );
}

function ErrorText({ children }) {
  if (!children) return null;
  return <p className="text-xs text-red-500 font-medium">{children}</p>;
}

/* ===================================================================
   MODAL
=================================================================== */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-red-500"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/* ===================================================================
   TOAST
=================================================================== */

function Toast({ type, message }) {
  return (
    <div
      className={`fixed top-6 right-6 px-4 py-3 rounded-xl text-white shadow-lg
      ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
}

