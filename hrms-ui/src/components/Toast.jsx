import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Toast({
  show,
  message,
  onClose,
  type = "success",
  duration = 3000,
}) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const config = {
    success: {
      icon: <FaCheckCircle />,
      color: "text-emerald-600",
      ring: "from-emerald-400/30 to-transparent",
    },
    error: {
      icon: <FaTimesCircle />,
      color: "text-red-500",
      ring: "from-red-400/30 to-transparent",
    },
    info: {
      icon: <FaInfoCircle />,
      color: "text-blue-500",
      ring: "from-blue-400/30 to-transparent",
    },
    warning: {
      icon: <FaExclamationCircle />,
      color: "text-amber-500",
      ring: "from-amber-400/30 to-transparent",
    },
  };

  const { icon, color, ring } = config[type];

  return (
    <div
      className="
        fixed top-6 right-6 z-50
        flex items-center
        animate-toast-in
      "
      role="status"
      aria-live="polite"
    >
      <div
        className="
          relative overflow-hidden
          flex items-center gap-3
          px-5 py-3
          rounded-2xl
          bg-white/60 backdrop-blur-[24px]
          border border-white/40
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          text-slate-800
          transition-all
          hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
        "
      >
        {/* GLOW RING */}
        <div
          className={`
            pointer-events-none
            absolute inset-0
            bg-gradient-to-br ${ring}
            opacity-60
          `}
        />

        {/* ICON */}
        <span className={`relative z-10 text-lg ${color}`}>
          {icon}
        </span>

        {/* MESSAGE */}
        <span className="relative z-10 text-sm font-medium">
          {message}
        </span>

        {/* CLOSE */}
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="
            relative z-10 ml-3
            w-7 h-7
            flex items-center justify-center
            rounded-full
            text-slate-500
            hover:text-slate-800
            hover:bg-slate-200/40
            transition
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}
