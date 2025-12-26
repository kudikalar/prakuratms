import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaTag } from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

/* ================= CONFIG ================= */

const DEFAULT_CATEGORIES = [
  "IT",
  "AI & ML",
  "Cloud Computing",
  "Cyber Security",
];

/* ================= COMPONENT ================= */

export default function CourseCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [confirmCategory, setConfirmCategory] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("courseCategories")) ||
      DEFAULT_CATEGORIES;

    setCategories(stored);
    localStorage.setItem("courseCategories", JSON.stringify(stored));
  }, []);

  /* ================= VALIDATION ================= */
  const validateCategory = (value) => {
    if (!value.trim()) return "Category name is required";
    if (value.trim().length < 3)
      return "Minimum 3 characters required";

    const exists = categories.some(
      (c) => c.toLowerCase() === value.trim().toLowerCase()
    );
    if (exists) return "Category already exists";

    return null;
  };

  /* ================= ADD ================= */
  const addCategory = () => {
    const error = validateCategory(newCategory);
    if (error) {
      setToast({ show: true, message: `⚠️ ${error}`, type: "error" });
      return;
    }

    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    localStorage.setItem("courseCategories", JSON.stringify(updated));

    setNewCategory("");
    setToast({
      show: true,
      message: "✅ Category added successfully",
      type: "success",
    });
  };

  /* ================= DELETE ================= */
  const deleteCategory = () => {
    const updated = categories.filter((c) => c !== confirmCategory);
    setCategories(updated);
    localStorage.setItem("courseCategories", JSON.stringify(updated));

    setConfirmCategory(null);
    setToast({
      show: true,
      message: "🗑️ Category deleted successfully",
      type: "success",
    });
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        max-w-4xl space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[32px] p-6 md:p-8
        shadow-[0_40px_120px_rgba(80,70,200,0.25)]
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Course Categories
          </h2>
          <p className="text-sm text-slate-600">
            Organize courses with structured categories
          </p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-white/70 border border-white/50 text-sm font-semibold">
          {categories.length} Categories
        </span>
      </div>

      {/* ADD CATEGORY */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="e.g. Data Science, DevOps, QA Testing"
            className="glass-input flex-1"
          />

          <button
            onClick={addCategory}
            className="
              flex items-center justify-center gap-2
              px-6 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              shadow-lg transition
            "
          >
            <FaPlus /> Add
          </button>
        </div>
      </GlassCard>

      {/* CATEGORY LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const isSystem = DEFAULT_CATEGORIES.includes(cat);

          return (
            <GlassCard key={cat} className="glass-hover">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaTag className="text-purple-600" />
                  <span className="font-semibold text-slate-800">
                    {cat}
                  </span>
                </div>

                {!isSystem && (
                  <button
                    onClick={() => setConfirmCategory(cat)}
                    className="
                      p-2 rounded-full
                      bg-rose-100 text-rose-600
                      hover:bg-rose-200 transition
                    "
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              {isSystem && (
                <p className="text-xs text-slate-500 mt-2">
                  System category (cannot be deleted)
                </p>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* CONFIRM DELETE */}
      {confirmCategory && (
        <ConfirmModal
          open={!!confirmCategory}
          title="Delete Category"
          message={`Are you sure you want to delete "${confirmCategory}"?`}
          onCancel={() => setConfirmCategory(null)}
          onConfirm={deleteCategory}
        />
      )}

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />
    </div>
  );
}

/* ================= GLASS ================= */

const GlassCard = ({ children, className = "" }) => (
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
