import { useState } from "react";
import PrakuraLogo from "../assets/prakura-logo.png";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiry: "Training Programs",
    priority: false,
    notifyEmail: true,
    notifyWhatsApp: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    // 🔌 API-ready payload
    const payload = {
      ...form,
      source: "Contact Page",
      createdAt: new Date().toISOString(),
    };

    console.log("SUBMIT PAYLOAD", payload);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="
      min-h-screen text-white
      bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.32),_transparent_60%),linear-gradient(180deg,#05050a,#020204)]
      flex items-center justify-center px-6 py-28
    "><button
  onClick={() => window.location.href = "/#/"}
  className="
    fixed top-6 left-6 z-50
    w-10 h-10 rounded-full
    bg-white/10 backdrop-blur-xl
    border border-white/20
    hover:scale-110 transition
  "
>
  ← Back    
</button>
      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16">

        {/* LEFT PANEL */}
        <div className="
          relative p-12 rounded-3xl
          bg-white/[0.08]
          border border-white/20
          backdrop-blur-2xl
          shadow-[0_50px_160px_rgba(147,51,234,0.35)]
        ">
          <div className="flex items-center gap-4 mb-8">
            <img src={PrakuraLogo} className="w-12" alt="Prakura" />
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-white">
                Contact Prakura
              </h1>
              <p className="text-xs text-purple-300 tracking-widest uppercase">
                Enterprise Learning Platform
              </p>
            </div>
            
          </div>
          

          <p className="text-gray-300 mb-10 text-sm leading-relaxed">
            Speak with our experts about <strong>AI-powered training</strong>,
            student career programs, enterprise LMS deployments, and hiring
            partnerships.
          </p>

          {/* PREMIUM FEATURES */}
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {[
              ["🚀 AI Career Guidance", "Skill gaps, mock interviews & roadmap"],
              ["🎓 Student Job Prep", "Interview readiness & referrals"],
              ["📊 Learning Analytics", "Progress, strengths & outcomes"],
              ["🏢 Enterprise LMS", "Batches, HR & compliance"],
              ["🔐 Secure Platform", "RBAC & audit logs"],
              ["🤝 Mentor Support", "Expert & enterprise mentors"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="
                  rounded-xl p-4
                  bg-white/10 border border-white/20
                  backdrop-blur-xl
                  transition hover:scale-[1.03]
                  hover:border-purple-400/50
                "
              >
                <strong className="text-sm">{title}</strong>
                <p className="text-xs text-gray-300 mt-1">{desc}</p>
              </div>
            ))}
          </div>

          {/* STUDENT BENEFITS */}
          <div className="rounded-2xl p-5 bg-purple-600/15 border border-purple-500/30 mb-10">
            <h3 className="font-semibold mb-2">🎓 What students get</h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Free consultation & learning roadmap</li>
              <li>• Course & placement guidance</li>
              <li>• Email / WhatsApp confirmation</li>
              <li>• Priority handling for urgent cases</li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-4 text-sm">
            <div className="bg-white/10 rounded-xl p-4">📍 Hyderabad, India</div>
            <div className="bg-white/10 rounded-xl p-4">📧 support@prakuraitsolutions.com</div>
            <div className="bg-white/10 rounded-xl p-4">📞 +91 9182370643</div>
            <div className="bg-white/10 rounded-xl p-4">🕒 Mon–Sat · 9:30 AM – 7:30 PM</div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="
          relative p-12 rounded-3xl
          bg-white/[0.08]
          border border-white/20
          backdrop-blur-2xl
          shadow-[0_50px_160px_rgba(147,51,234,0.35)]
        ">
          <h2 className="text-2xl font-semibold mb-2">
            Tell us about your requirement
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Response within <strong>24 business hours</strong>
          </p>

          {submitted ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-2xl font-bold mb-2">
                Request received
              </h3>
              <p className="text-gray-300 text-sm">
                Confirmation sent to your selected notification channels.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              <select name="inquiry" value={form.inquiry} onChange={handleChange} className="glass-input">
                <option>Training Programs</option>
                <option>Enterprise LMS</option>
                <option>Hiring / Placement</option>
                <option>College / Institution</option>
                <option>Other</option>
              </select>

              <input name="name" placeholder="Your Name *" className="glass-input" value={form.name} onChange={handleChange} />
              <input name="email" type="email" placeholder="Email Address *" className="glass-input" value={form.email} onChange={handleChange} />
              <input name="phone" placeholder="Phone Number" className="glass-input" value={form.phone} onChange={handleChange} />

              <textarea
                name="message"
                rows={4}
                placeholder="Describe your requirement *"
                className="glass-input resize-none"
                value={form.message}
                onChange={handleChange}
              />

              {/* NOTIFICATIONS */}
              <div className="space-y-2 text-sm text-gray-300">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.notifyEmail}
                    onChange={(e) => setForm({ ...form, notifyEmail: e.target.checked })} />
                  Notify me via Email
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.notifyWhatsApp}
                    onChange={(e) => setForm({ ...form, notifyWhatsApp: e.target.checked })} />
                  Notify me via WhatsApp / SMS
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.checked })} />
                  Mark as high priority
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  btn-primary w-full mt-6 text-lg font-semibold
                  hover:shadow-[0_0_50px_rgba(168,85,247,0.7)]
                  disabled:opacity-60
                "
              >
                {loading ? "Submitting..." : "Request Consultation"}
              </button>

              <p className="text-[11px] text-center text-gray-400 mt-4">
                🔒 Your data is secure · No spam · Unsubscribe anytime
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
