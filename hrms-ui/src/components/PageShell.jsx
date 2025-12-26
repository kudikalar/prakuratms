export default function PageShell({ title, subtitle, action, children }) {
  return (
    <div
      className="
        max-w-6xl mx-auto space-y-10 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      {(title || action) && (
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-600">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}

      {children}
    </div>
  );
}
