import { useEffect } from "react";

export default function LegalModal({ title, onClose }) {
  /* ================= ESC KEY CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* BACKDROP */}
      <div
        className="
          absolute inset-0
          bg-black/40
          backdrop-blur-md
          animate-fadeIn
        "
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-lg
          max-h-[85vh] overflow-hidden
          rounded-3xl
          animate-scaleIn
        "
      >
        {/* GLASS LAYERS */}
        <div
          className="
            absolute inset-0
            bg-white/55 backdrop-blur-[28px]
            border border-white/40
            rounded-3xl
            shadow-[0_30px_90px_rgba(0,0,0,0.25)]
          "
        />

        {/* TOP LIGHT */}
        <div
          className="
            pointer-events-none
            absolute top-0 left-0 right-0
            h-1/2
            bg-gradient-to-b
            from-white/50 to-transparent
            rounded-t-3xl
          "
        />

        {/* CONTENT */}
        <div className="relative z-10 p-6 sm:p-7 overflow-y-auto max-h-[85vh]">
          {/* CLOSE */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              absolute top-4 right-4
              w-9 h-9
              rounded-full
              flex items-center justify-center
              text-slate-600
              hover:text-red-500
              hover:bg-red-50
              transition
            "
          >
            ✕
          </button>

          {/* HEADER */}
          <h3 className="text-xl font-semibold text-slate-800 mb-5">
            {title}
          </h3>

          {/* BODY */}
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              Prakura IT Solutions provides enterprise-grade LMS, TMS, and HRMS
              platforms designed to securely manage learning, training, and
              organizational operations. By accessing or using our systems,
              users agree to comply with all applicable company policies,
              security standards, and legal regulations.
            </p>

            <p>
              Users are responsible for maintaining the confidentiality of
              their login credentials and for all activities conducted through
              their accounts. Unauthorized access, misuse of data, or attempts
              to compromise system integrity may result in suspension or
              termination of access without prior notice.
            </p>

            <p>
              We collect and process personal information solely for
              authentication, service delivery, and platform improvement
              purposes. Data is never sold to third parties and is handled in
              accordance with applicable data protection laws. Prakura IT
              Solutions reserves the right to update these terms and privacy
              policies periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
