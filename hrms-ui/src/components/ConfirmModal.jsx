import { useEffect } from "react";

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  variant = "danger", // danger | primary
}) {
  /* ================= ESC KEY CLOSE ================= */
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onCancel]);

  if (!open) return null;

  const variants = {
    danger: {
      button: "bg-red-500 hover:bg-red-600",
      glow: "from-red-400/30 to-transparent",
    },
    primary: {
      button: "bg-purple-600 hover:bg-purple-700",
      glow: "from-purple-400/30 to-transparent",
    },
  };

  const { button, glow } = variants[variant];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
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
        onClick={onCancel}
      />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-sm
          rounded-3xl
          animate-scaleIn
        "
      >
        {/* GLASS SURFACE */}
        <div
          className="
            absolute inset-0
            bg-white/55 backdrop-blur-[28px]
            border border-white/40
            rounded-3xl
            shadow-[0_30px_90px_rgba(0,0,0,0.3)]
          "
        />

        {/* GLOW RING */}
        <div
          className={`
            pointer-events-none
            absolute inset-0
            bg-gradient-to-br ${glow}
            opacity-60
            rounded-3xl
          `}
        />

        {/* CONTENT */}
        <div className="relative z-10 p-6">
          {/* TITLE */}
          <h3
            id="confirm-title"
            className="text-lg font-semibold text-slate-800 mb-2"
          >
            {title}
          </h3>

          {/* MESSAGE */}
          <p
            id="confirm-message"
            className="text-sm text-slate-600 mb-6 leading-relaxed"
          >
            {message}
          </p>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="
                px-4 py-2 rounded-full
                bg-slate-200/80 hover:bg-slate-300/80
                text-slate-700
                font-semibold
                transition
              "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className={`
                px-4 py-2 rounded-full
                text-white font-semibold
                shadow-lg
                transition-all
                active:scale-[0.97]
                ${button}
              `}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
