import { FaCheckCircle } from "react-icons/fa";

export default function Toast({ show, message, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className="
          flex items-center gap-3
          bg-white/60 backdrop-blur-[24px]
          border border-white/40
          px-5 py-3 rounded-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          text-gray-800
          animate-slide-in
        "
      >
        <FaCheckCircle className="text-green-600" />
        <span className="text-sm font-medium">{message}</span>

        <button
          onClick={onClose}
          className="ml-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
