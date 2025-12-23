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
  FaCheckCircle,
  FaGoogle,
  FaMicrosoft,
  FaTimes,
} from "react-icons/fa";

import logo from "../assets/prakura-logo.png";
import illustration from "../assets/login-illustration.png";

/* ================= ROLE THEMES ================= */
const roleConfig = {
  Student: {
    text: "text-emerald-500",
    ring: "focus:ring-emerald-400/40",
    btn: "from-emerald-500/90 to-green-500/90",
  },
  Educator: {
    text: "text-blue-500",
    ring: "focus:ring-blue-400/40",
    btn: "from-blue-500/90 to-cyan-500/90",
  },
  Admin: {
    text: "text-purple-500",
    ring: "focus:ring-purple-400/40",
    btn: "from-purple-500/90 to-pink-500/90",
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
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("Student");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const theme = roleConfig[role];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* REMEMBER ROLE */
  useEffect(() => {
    const saved = localStorage.getItem("loginRole");
    if (saved && roleConfig[saved]) setRole(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("loginRole", role);
  }, [role]);

  /* VALIDATION */
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email address";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* LOGIN (demo safe) */
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  setErrors({});

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.message || "Invalid credentials" });
      setLoading(false);
      return;
    }

    // ✅ STORE AUTH
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("loginRole", role);

    if (rememberMe) {
      localStorage.setItem("rememberEmail", email);
    }

    // ✅ ROLE-BASED REDIRECT
    if (data.user.role === "Admin") {
      window.location.href = "/admin/dashboard";
    } else if (data.user.role === "Educator") {
      window.location.href = "/educator/dashboard";
    } else {
      window.location.href = "/student/dashboard";
    }
  } catch (err) {
    setErrors({
      general: "Server not reachable. Please try again later.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br 
  from-slate-200 via-slate-300/80 to-slate-400/60 
  flex flex-col">


      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-6 text-white">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" />
          <span className="font-semibold text-lg text-black">
            Prakura IT Solutions
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-3xl
          bg-white/30 backdrop-blur-2xl border border-white/40 shadow-[0_40px_120px_rgba(0,0,0,0.25)]
          overflow-hidden">

          {/* LEFT */}
          <div className="bg-gradient-to-br from-teal-600/90 to-cyan-600/90 text-white p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="text-white/90 mb-8">
              Securely access your LMS & TMS dashboard.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <FaCheckCircle className="text-emerald-300" />
                Enterprise-grade security
              </li>
              <li className="flex gap-3">
                <FaCheckCircle className="text-emerald-300" />
                Role-based dashboards
              </li>
              <li className="flex gap-3">
                <FaCheckCircle className="text-emerald-300" />
                Scalable training platform
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div className="p-12 flex flex-col justify-center">

            <div className="text-center mb-8">
              <img src={logo} className="w-14 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-800">
                Login Account
              </h2>
            </div>

            {/* ROLE SWITCH – GLASS */}
            <div className="flex justify-center mb-6">
              <div className="flex rounded-xl bg-white/40 backdrop-blur-xl
                border border-white/50 p-1 shadow-inner">
                {roles.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setRole(r.name)}
                    className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm transition
                      ${
                        role === r.name
                          ? `bg-white/60 shadow ${theme.text}`
                          : "text-slate-600 hover:text-purple-600"
                      }`}
                  >
                    {r.icon}
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SSO – GLASS */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg
                bg-white/40 backdrop-blur border border-white/50 hover:bg-white/60 transition">
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg
                bg-white/40 backdrop-blur border border-white/50 hover:bg-white/60 transition">
                <FaMicrosoft className="text-blue-600" /> Microsoft
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 mb-4">
              or sign in with email
            </div>

            {/* FORM – GLASS INPUTS */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-sm text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full mt-1 px-4 py-3 rounded-xl
                    bg-white/40 backdrop-blur-xl
                    border border-white/50
                    focus:outline-none focus:ring-2 ${theme.ring}`}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full mt-1 px-4 py-3 rounded-xl
                      bg-white/40 backdrop-blur-xl
                      border border-white/50
                      focus:outline-none focus:ring-2 ${theme.ring}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-500 hover:text-purple-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-purple-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* SIGN IN – GLASS BUTTON */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r ${theme.btn}
                  backdrop-blur
                  shadow-lg hover:shadow-2xl hover:scale-[1.02] transition`}
              >
                {loading ? "Signing in..." : `Sign In as ${role}`}
              </button>
            </form>

            <div className="mt-6 text-xs flex justify-center gap-2 text-slate-500">
              <FaShieldAlt className={theme.text} />
              Secure authentication
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-white/80 py-4">
        © {new Date().getFullYear()} Prakura IT Solutions
      </footer>

      {/* FORGOT PASSWORD MODAL – GLASS */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur"
            onClick={() => setForgotOpen(false)}
          />
          <div className="relative bg-white/70 backdrop-blur-xl
            border border-white/50 rounded-2xl p-6 w-96 shadow-xl">
            <button
              onClick={() => setForgotOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-semibold mb-2">
              Reset Password
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Enter your registered email to receive reset instructions.
            </p>

            <input
              placeholder="Email address"
              className="w-full px-4 py-2 rounded-lg
                bg-white/60 backdrop-blur border border-white/50 mb-4"
            />

            <button className="w-full py-2 rounded-lg bg-purple-600 text-white">
              Send Reset Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
