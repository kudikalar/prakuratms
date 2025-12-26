export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white/40 backdrop-blur-[24px]
        border border-white/40
        rounded-3xl p-6
        shadow-[0_30px_90px_rgba(0,0,0,0.2)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
