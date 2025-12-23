export default function CourseContent() {
  return (
    <div className="max-w-4xl space-y-6 text-gray-800">

      <div>
        <h2 className="text-2xl font-bold">Syllabus & Content</h2>
        <p className="text-sm text-gray-600">
          Manage modules and syllabus for courses
        </p>
      </div>

      <GlassCard>
        <div className="space-y-4">

          <Input label="Course" placeholder="Select Course" />
          <Input label="Module Title" placeholder="Module 1: Introduction" />

          <textarea
            rows="4"
            className="w-full p-3 rounded-xl bg-white/70 border"
            placeholder="Topics covered in this module..."
          />

          <button
            className="px-6 py-2.5 rounded-full
              bg-purple-600 hover:bg-purple-700
              text-white font-semibold shadow"
          >
            Add Module
          </button>

        </div>
      </GlassCard>
    </div>
  );
}

/* ===== Shared UI ===== */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-3 rounded-xl bg-white/70 border"
    />
  </div>
);

const GlassCard = ({ children }) => (
  <div className="
    bg-white/40 backdrop-blur-[24px]
    border border-white/40
    rounded-3xl p-6
    shadow-[0_30px_90px_rgba(0,0,0,0.2)]
  ">
    {children}
  </div>
);
