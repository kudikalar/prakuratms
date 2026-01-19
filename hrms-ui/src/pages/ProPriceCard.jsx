import {
  FaBook,
  FaVideo,
  FaTasks,
  FaChartLine,
  FaCertificate,
  FaUsers,
  FaRobot,
  FaProjectDiagram,
  FaUserTie,
  FaLock,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";

/* ================= ICON MAP ================= */

const ICONS = {
  book: FaBook,
  video: FaVideo,
  quiz: FaTasks,
  task: FaTasks,
  chart: FaChartLine,
  cert: FaCertificate,
  community: FaUsers,
  ai: FaRobot,
  project: FaProjectDiagram,
  resume: FaUserTie,
  admin: FaShieldAlt,
};

/* ================= COMPONENT ================= */

export default function ProPriceCard({
  title,
  price,
  period,
  features,
  popular = false,
}) {
  return (
    <div
      className={`
        relative rounded-3xl p-8
        bg-white/[0.07] backdrop-blur-2xl
        border border-white/15
        shadow-[0_30px_120px_rgba(0,0,0,0.45)]
        transition-all duration-500
        hover:-translate-y-2 hover:border-purple-400/40
        hover:shadow-[0_50px_160px_rgba(147,51,234,0.45)]
      `}
    >
      {/* 🌟 POPULAR BADGE */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="
            px-4 py-1 rounded-full text-xs font-bold
            bg-gradient-to-r from-purple-500 to-pink-500
            text-white shadow-lg
            flex items-center gap-2
          ">
            <FaStar className="text-yellow-300" />
            Most Popular
          </span>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold tracking-wide">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{period}</p>

        <div className="mt-5">
          <span className="text-4xl font-extrabold">{price}</span>
          {price !== "Custom" && (
            <span className="text-sm text-gray-400 ml-1">/ plan</span>
          )}
        </div>
      </div>

      {/* FEATURES */}
      <ul className="space-y-3 mb-8">
        {features.map((f, i) => {
          const Icon = ICONS[f.icon] || FaBook;

          return (
            <li
              key={i}
              className={`
                flex items-start gap-3 rounded-xl px-3 py-2
                transition-all
                ${f.locked
                  ? "opacity-40 blur-[0.4px]"
                  : "hover:bg-white/10"}
              `}
            >
              <div
                className={`
                  mt-1 text-sm
                  ${f.loved ? "text-pink-400" : "text-purple-400"}
                `}
              >
                {f.locked ? <FaLock /> : <Icon />}
              </div>

              <span className="text-sm leading-relaxed">
                {f.label}
                {f.loved && (
                  <span className="ml-2 text-xs text-pink-400">❤️</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <button
        className={`
          w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-purple-600 to-pink-600
          text-white
          shadow-[0_15px_40px_rgba(147,51,234,0.5)]
          hover:scale-[1.02] transition
        `}
      >
        {price === "Custom" ? "Contact Sales" : "Get Started"}
      </button>
    </div>
  );
}