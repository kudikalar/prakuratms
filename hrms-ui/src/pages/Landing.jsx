import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrakuraLogo from "../assets/prakura-logo.png";

/* ================= SAFE AUTH FALLBACK ================= */
const useAuthStore = (cb) =>
  cb({ hasSubscription: false, plan: null });

/* ================= ICON MAP ================= */
const iconMap = {
  book: "📘",
  video: "🎥",
  quiz: "🧠",
  task: "📝",
  chart: "📊",
  cert: "🎓",
  community: "👥",
  ai: "🤖",
  project: "🚀",
  resume: "📄",
  admin: "🛠️",
  lock: "🔒",
};

/* ================= FEATURE CARD ================= */
function ProFeatureCard({ tag, title, desc, outcome }) {
  return (
    <div className="rounded-3xl p-7 bg-white border border-orange-200 shadow-md">
      <span className="text-xs font-semibold tracking-wider text-orange-600">
        {tag}
      </span>
      <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
      <p className="mt-4 text-xs text-orange-600">● {outcome}</p>
    </div>
  );
}

/* ================= STATS ================= */
function StatTile({ value, label }) {
  return (
    <div className="rounded-2xl p-6 text-center bg-white border border-orange-200">
      <p className="text-3xl font-extrabold text-orange-600">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-widest text-slate-600">
        {label}
      </p>
    </div>
  );
}

/* ================= ADVANCED FEATURE TILE ================= */
function FeatureTile({ title, desc }) {
  return (
    <div className="rounded-3xl p-6 bg-white border border-orange-200">
      <h3 className="font-semibold mb-2 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}

/* ================= PRICING CARD ================= */
function ProPriceCard({ title, price, period, features, popular }) {
  return (
    <div
      className={`relative rounded-3xl p-8 bg-white border transition
      ${
        popular
          ? "border-orange-400 shadow-2xl scale-[1.04]"
          : "border-orange-200 shadow-lg"
      }`}
    >
      {popular && (
        <span className="absolute top-4 right-4 text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-300">
          Most Popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-4xl font-extrabold text-orange-600">{price}</p>
      <p className="text-sm text-slate-500 mb-6">{period}</p>

      <ul className="space-y-3 text-sm">
        {features.map((f) => (
          <li
            key={f.label}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 border
              ${
                f.locked
                  ? "bg-slate-50 border-slate-200 text-slate-400"
                  : "bg-white border-orange-200"
              }`}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100">
              {f.locked ? iconMap.lock : iconMap[f.icon]}
            </span>
            <span className="flex-1">{f.label}</span>
            {!f.locked && (
              <span className="text-xs text-green-600">Included</span>
            )}
          </li>
        ))}
      </ul>

      <button className="mt-8 w-full py-3 rounded-xl font-semibold bg-orange-600 text-white hover:bg-orange-700 transition">
        Choose Plan
      </button>
    </div>
  );
}

/* ================= MAIN ================= */
export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featureRef = useRef(null);
  const pricingRef = useRef(null);
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100">

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={PrakuraLogo} className="w-9" />
            <span className="font-bold text-slate-900">Prakura LMS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-slate-700">
            <button onClick={() => featureRef.current.scrollIntoView({ behavior: "smooth" })}>Features</button>
            <button onClick={() => pricingRef.current.scrollIntoView({ behavior: "smooth" })}>Pricing</button>
            <button onClick={() => navigate("/login")}>Sign in</button>
            <button onClick={() => navigate("/contact")} className="bg-orange-600 text-white px-4 py-2 rounded-lg">
              Contact Us
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-7xl mx-auto px-6 space-y-32">

        {/* HERO */}
        <section ref={heroRef} className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-orange-600">
            Learn. Practice. Get Hired.
          </h1>
          <p className="text-slate-600 text-lg">
            AI-powered LMS for students, professionals & enterprises
          </p>
        </section>

        {/* SOCIAL PROOF — RESTORED */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatTile value="25,000+" label="Students Enrolled" />
          <StatTile value="8,500+" label="Students Placed" />
          <StatTile value="300+" label="Hiring Partners" />
          <StatTile value="120+" label="Industry Mentors" />
        </section>

        {/* CORE FEATURES — RESTORED */}
        <section ref={featureRef} className="grid md:grid-cols-3 gap-8">
          <ProFeatureCard
            tag="AI"
            title="AI Mock Interviews"
            desc="Interview simulations with instant feedback."
            outcome="Higher confidence"
          />
          <ProFeatureCard
            tag="STRUCTURED"
            title="Job-ready Courses"
            desc="Industry-aligned curriculum."
            outcome="Faster learning"
          />
          <ProFeatureCard
            tag="ENTERPRISE"
            title="HR & Admin LMS"
            desc="Analytics & compliance."
            outcome="Team insights"
          />
        </section>

        {/* ADVANCED FEATURES — RESTORED */}
        <section className="grid md:grid-cols-3 gap-8">
          <FeatureTile
            title="Skill Gap Analysis"
            desc="AI identifies missing skills."
          />
          <FeatureTile
            title="Hiring Readiness Score"
            desc="Recruiter-friendly scoring."
          />
          <FeatureTile
            title="Capstone Projects"
            desc="Enterprise-grade projects."
          />
        </section>

        {/* PRICING — UNCHANGED / FULL */}
        <section ref={pricingRef}>
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Flexible Pricing Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* STARTER */}
            <ProPriceCard
              title="Starter"
              price={billing === "monthly" ? "₹499" : "₹4,999"}
              period="Beginners"
              features={[
                { label: "1 course access", icon: "book" },
                { label: "Recorded HD videos", icon: "video" },
                { label: "Topic-wise practice quizzes", icon: "quiz" },
                { label: "Hands-on assignments", icon: "task" },
                { label: "Auto progress tracking", icon: "chart" },
                { label: "Course completion certificate", icon: "cert" },
                { label: "Learner community access", icon: "community" },
                { label: "Mobile & desktop access", icon: "community" },
                { label: "Basic doubt clarification", icon: "community" },
                { label: "AI mock interviews", icon: "ai", locked: true },
                { label: "Resume & LinkedIn review", icon: "resume", locked: true },
                { label: "Real-world projects", icon: "project", locked: true },
                { label: "Placement assistance", icon: "community", locked: true },
              ]}
            />

            {/* PROFESSIONAL */}
            <ProPriceCard
              title="Professional"
              popular
              price={billing === "monthly" ? "₹4,499" : "₹44,999"}
              period="Career focused"
              features={[
                { label: "Multiple course access", icon: "book" },
                { label: "Structured learning paths", icon: "book" },
                { label: "Recorded HD videos (lifetime)", icon: "video" },
                { label: "Advanced practice quizzes", icon: "quiz" },
                { label: "Hands-on real-world projects", icon: "project" },
                { label: "AI-powered mock interviews", icon: "ai" },
                { label: "Skill-wise assessments", icon: "chart" },
                { label: "Interview readiness score", icon: "chart" },
                { label: "Resume & LinkedIn profile review", icon: "resume" },
                { label: "Career roadmap & guidance", icon: "community" },
                { label: "Priority mentor support", icon: "community" },
                { label: "Industry-recognized certificates", icon: "cert" },
                { label: "Dedicated mentor", icon: "community", locked: true },
                { label: "Hiring partner referrals", icon: "community", locked: true },
                { label: "Internal mobility analytics", icon: "chart", locked: true },
              ]}
            />

            {/* ADVANCED */}
            <ProPriceCard
              title="Advanced"
              price="Custom"
              period="Teams & Enterprises"
              features={[
                { label: "Unlimited course & path access", icon: "book" },
                { label: "Live instructor-led sessions", icon: "video" },
                { label: "Enterprise-grade capstone projects", icon: "project" },
                { label: "AI interview & assessment engine", icon: "ai" },
                { label: "Role-based learning tracks", icon: "book" },
                { label: "Admin & HR management dashboard", icon: "admin" },
                { label: "Batch, attendance & performance tracking", icon: "chart" },
                { label: "Hiring readiness & skill gap analytics", icon: "chart" },
                { label: "Certificate & skill verification", icon: "cert" },
                { label: "Internal hiring & referrals", icon: "community" },
                { label: "SSO & enterprise security", icon: "admin" },
                { label: "Audit logs & compliance reports", icon: "admin" },
                { label: "Dedicated success manager", icon: "community" },
                { label: "SLA-backed priority support", icon: "community" },
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="mt-32 py-12 text-center text-xs text-slate-500 border-t border-orange-200">
        © {new Date().getFullYear()} Prakura LMS — Enterprise Training Platform
      </footer>
    </div>
  );
}
