import { useState } from "react";
import GlassCard from "../components/GlassCard";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login API will be connected later");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-5xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div
          className="hidden md:flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521791136064-7986c2920216')",
          }}
        >
          <div className="bg-black/60 w-full h-full flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold px-10 text-center">
              Welcome to Prakura HRMS
            </h2>
          </div>
        </div>
        <div className="p-10 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-400 mb-8">
            Enter your credentials to continue
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-slate-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
            >
              Sign In
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} Prakura IT Solutions
          </p>
        </div>
      </div>
    </div>
  );
}
