export default function GlassCard({
  children,
  className = "",
  variant = "default",
  hover = true,
}) {
  const variants = {
    default:
      "bg-white/45 border-white/40",
    subtle:
      "bg-white/30 border-white/30",
    solid:
      "bg-white/70 border-white/60",
  };

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-3xl p-6
        backdrop-blur-[28px]
        border
        ${variants[variant]}

        shadow-[0_30px_90px_rgba(0,0,0,0.18)]
        transition-all duration-500 ease-out
        will-change-transform

        ${
          hover
            ? `
              hover:-translate-y-1
              hover:shadow-[0_40px_110px_rgba(0,0,0,0.25)]
            `
            : ""
        }

        ${className}
      `}
    >
      {/* ✨ Gradient glow layer */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-3xl
          bg-gradient-to-br
          from-white/30 via-transparent to-purple-300/20
          opacity-60
        "
      />

      {/* ✨ Top highlight */}
      <div
        className="
          pointer-events-none
          absolute top-0 left-0 right-0
          h-1/2
          bg-gradient-to-b
          from-white/40 to-transparent
          opacity-40
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
