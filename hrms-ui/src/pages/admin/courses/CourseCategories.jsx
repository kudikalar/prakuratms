import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaTrash,
  FaTag,
  FaSearch,
} from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

/* ================= CONFIG ================= */

const CATEGORY_KEY = "PRAKURA_COURSE_CATEGORIES";

const DEFAULT_CATEGORIES = [
  "IT",
  "AI & ML",
  "Cloud Computing",
  "Cyber Security",
];

/* ================= HELPERS ================= */

/**
 * 🔒 Production-safe migration
 * - Handles old string categories
 * - Ensures required fields
 */
const normalizeCategories = (stored) => {
  if (!Array.isArray(stored)) return [];

  return stored.map((c) => {
    if (typeof c === "string") {
      return {
        name: c,
        description: "System default category",
        status: "Active",
        createdAt: new Date().toISOString(),
      };
    }

    return {
      name: c.name,
      description: c.description || "No description provided",
      status: c.status ?? "Active",
      createdAt:
        c.createdAt && !isNaN(new Date(c.createdAt))
          ? c.createdAt
          : new Date().toISOString(),
    };
  });
};

/* ================= COMPONENT ================= */

export default function CourseCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [confirmCategory, setConfirmCategory] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  /* ================= LOAD & SYNC ================= */

  useEffect(() => {
    const loadCategories = () => {
      const raw =
        JSON.parse(localStorage.getItem(CATEGORY_KEY)) ||
        DEFAULT_CATEGORIES;

      const normalized = normalizeCategories(raw);

      setCategories(normalized);
      localStorage.setItem(
        CATEGORY_KEY,
        JSON.stringify(normalized)
      );
    };

    // Initial load
    loadCategories();

    // Same-tab + cross-tab sync
    window.addEventListener("storage", loadCategories);
    window.addEventListener("focus", loadCategories);
    document.addEventListener(
      "visibilitychange",
      loadCategories
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadCategories
      );
      window.removeEventListener(
        "focus",
        loadCategories
      );
      document.removeEventListener(
        "visibilitychange",
        loadCategories
      );
    };
  }, []);

  /* ================= VALIDATION ================= */

  const validateCategory = (value) => {
    if (!value.trim())
      return "Category name is required";
    if (value.trim().length < 3)
      return "Minimum 3 characters required";

    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() ===
        value.trim().toLowerCase()
    );
    if (exists) return "Category already exists";

    return null;
  };

  /* ================= ADD ================= */

  const addCategory = () => {
    const error = validateCategory(newCategory);
    if (error) {
      setToast({
        show: true,
        message: `⚠️ ${error}`,
        type: "error",
      });
      return;
    }

    const updated = [
      ...categories,
      {
        name: newCategory.trim(),
        description:
          description.trim() ||
          "No description provided",
        status: "Active",
        createdAt: new Date().toISOString(),
      },
    ];

    setCategories(updated);
    localStorage.setItem(
      CATEGORY_KEY,
      JSON.stringify(updated)
    );

    // 🔥 notify listeners (same-tab)
    window.dispatchEvent(new Event("storage"));

    setNewCategory("");
    setDescription("");
    setToast({
      show: true,
      message: "✅ Category added successfully",
      type: "success",
    });
  };

  /* ================= DELETE ================= */

  const deleteCategory = () => {
    const updated = categories.filter(
      (c) => c.name !== confirmCategory
    );

    setCategories(updated);
    localStorage.setItem(
      CATEGORY_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(new Event("storage"));

    setConfirmCategory(null);
    setToast({
      show: true,
      message: "🗑️ Category deleted successfully",
      type: "success",
    });
  };

  /* ================= SEARCH ================= */

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter((c) =>
      c.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, categories]);

  /* ================= UI ================= */

  return (
    <div
      data-testid="course-categories-page"
      className="
        max-w-5xl mx-auto space-y-8 animate-fadeIn
        bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100
        rounded-[36px] p-6 md:p-8
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
            Manage LMS / TMS course classification
          </p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-white/70 border text-sm font-semibold">
          {categories.length} Categories
        </span>
      </div>

      {/* SEARCH */}
      <GlassCard>
        <div className="relative">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search categories..."
            className="glass-input pl-10"
          />
        </div>
      </GlassCard>

      {/* ADD */}
      <GlassCard>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={newCategory}
            onChange={(e) =>
              setNewCategory(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && addCategory()
            }
            placeholder="Category name"
            className="glass-input"
          />

          <input
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Optional description"
            className="glass-input"
          />

          <button
            onClick={addCategory}
            disabled={!newCategory.trim()}
            className="
              flex items-center justify-center gap-2
              px-6 py-3 rounded-full
              font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              disabled:opacity-50
              shadow-lg transition
            "
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </GlassCard>

      {/* LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const isSystem =
            DEFAULT_CATEGORIES.includes(cat.name);

          return (
            <GlassCard key={cat.name}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <FaTag className="text-purple-600" />
                    <span className="font-semibold text-slate-800">
                      {cat.name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    {cat.description}
                  </p>
                </div>

                {!isSystem && (
                  <button
                    onClick={() =>
                      setConfirmCategory(cat.name)
                    }
                    className="p-2 rounded-full bg-rose-100 text-rose-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              {isSystem && (
                <p className="text-xs text-slate-500 mt-3">
                  🔒 System category (protected)
                </p>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* CONFIRM */}
      {confirmCategory && (
        <ConfirmModal
          open
          title="Delete Category"
          message={`Delete "${confirmCategory}"?`}
          onCancel={() =>
            setConfirmCategory(null)
          }
          onConfirm={deleteCategory}
        />
      )}

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() =>
          setToast({
            show: false,
            message: "",
            type: "success",
          })
        }
      />
    </div>
  );
}

/* ================= GLASS CARD ================= */

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
