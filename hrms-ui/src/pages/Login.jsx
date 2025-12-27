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
  FaGoogle,
  FaMicrosoft,
} from "react-icons/fa";

import logo from "../assets/prakura-logo.png";
import { APP_BASE } from "../utils/basePath";

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

/* ================= ENV ================= */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROLE_ENDPOINT = {
  Student: "student",
  Educator: "educator",
  Admin: "admin",
};

/* ================= COMPONENT ================= */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    terms: "",
  });

  useEffect(() => {
    const savedRole = localStorage.getItem("loginRole");
    if (savedRole && roleContent[savedRole]) {
      setRole(savedRole);
    }
  }, []);

  /* ================= HELPERS ================= */

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    let valid = true;
    const e = { email: "", password: "", terms: "" };

    if (!email) {
      e.email = "Email is required";
      valid = false;
    }
    if (!password) {
      e.password = "Password is required";
      valid = false;
    }
    if (!acceptedTerms) {
      e.terms = "Please accept Terms & Privacy Policy";
      valid = false;
    }

    setErrors(e);
    return valid;
  };

  /* 🔥 ROLE NORMALIZER (ADDED – NO REMOVALS) */
  const normalizeRole = (r) => r?.toUpperCase();

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const endpoint = ROLE_ENDPOINT[role];
      if (!endpoint) {
        showToast("error", "Invalid role selected");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/auth/${endpoint}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "Invalid credentials");
        return;
      }

      /* 🔥 NORMALIZE USER ROLE (FIX) */
      const normalizedUser = {
        ...data.user,
        role: normalizeRole(role),
      };

      // Persist session (UNCHANGED, ONLY WRAPPED USER)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("loginRole", role);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      showToast("success", "Login successful. Redirecting...");

      /* 🔥 SAFE REDIRECT (EDUCATOR FIX, NO REMOVAL) */
      const safeRedirect =
        role === "Educator"
          ? "/admin/dashboard"
          : roleContent[role].redirect;

      setTimeout(() => {
        window.location.replace(
          `${APP_BASE}/#${safeRedirect}`
        );
      }, 1200);
    } catch (err) {
      console.error("Login error:", err);
      showToast("error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="flex justify-center px-4 py-5">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow flex items-center gap-3 p-4">
          <img src={logo} className="w-10 h-10" />
          <span className="text-lg font-semibold">
            <span className="text-blue-600 font-bold">TMS</span>{" "}
            Prakura IT Solutions
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl shadow-xl overflow-hidden">

          {/* LEFT */}
          <div className="hidden lg:flex flex-col justify-center px-16 text-white
            bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900">
            <img src={logo} className="w-14 h-14 mb-8" />
            <h2 className="text-4xl font-bold mb-4">
              {roleContent[role].title}
            </h2>
            <p className="text-blue-100 text-sm">
              {roleContent[role].desc}
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-white px-10 py-14">
            <h1 className="text-3xl font-semibold mb-2">Welcome 👋</h1>
            <p className="text-slate-500 mb-8">
              Login to your account
            </p>

            {/* ROLE SELECT */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {roles.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setRole(r.name)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition
                  ${
                    role === r.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r.icon}
                  {r.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                icon={<FaEnvelope />}
                value={email}
                onChange={setEmail}
                placeholder="Email address"
              />
              {errors.email && <Error>{errors.email}</Error>}

              <Input
                icon={<FaLock />}
                value={password}
                onChange={setPassword}
                placeholder="Password"
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
              {errors.password && <Error>{errors.password}</Error>}

              <div className="flex justify-between text-xs text-slate-500">
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>

              <label className="flex gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                I agree to Terms & Privacy Policy
              </label>
              {errors.terms && <Error>{errors.terms}</Error>}

              <button
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  className="flex gap-2 justify-center border py-2 rounded"
                >
                  <FaGoogle /> Google
                </button>
                <button
                  type="button"
                  className="flex gap-2 justify-center border py-2 rounded"
                >
                  <FaMicrosoft /> Microsoft
                </button>
              </div>

              <div className="mt-6 text-xs text-slate-400 flex justify-center gap-2">
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
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

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
        className="w-full pl-12 pr-12 py-3 rounded-xl border"
      />
      {right && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          {right}
        </span>
      )}
    </div>
  );
}

function Error({ children }) {
  return <p className="text-xs text-red-500">{children}</p>;
}

function Social({ icon, url }) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {icon}
    </a>
  );
}

function Toast({ type, message }) {
  return (
    <div
      className={`fixed top-6 right-6 px-4 py-3 rounded text-white ${
        type === "success" ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
