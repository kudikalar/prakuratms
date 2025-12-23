import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import Toast from "../../../components/Toast";

export default function CourseCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [toast, setToast] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* ================= LOAD FROM LOCAL STORAGE ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courseCategories"));
    if (stored && stored.length > 0) {
      setCategories(stored);
    } else {
      const defaults = ["IT", "AI & ML", "Cloud Computing", "Cyber Security"];
      setCategories(defaults);
      localStorage.setItem("courseCategories", JSON.stringify(defaults));
    }
  }, []);

  /* ================= ADD CATEGORY ================= */
  const addCategory = () => {
    if (!newCategory.trim()) return;

    if (categories.includes(newCategory)) {
      setToast("⚠️ Category already exists");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    localStorage.setItem("courseCategories", JSON.stringify(updated));

    setNewCategory("");
    setToast("✅ Category added successfully");
    setTimeout(() => setToast(""), 2000);
  };

  /* ================= DELETE FLOW ================= */
  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const deleteCategory = () => {
    const updated = categories.filter((c) => c !== selectedCategory);
    setCategories(updated);
    localStorage.setItem("courseCategories", JSON.stringify(updated));

    setShowModal(false);
    setSelectedCategory(null);
    setToast("🗑️ Category deleted successfully");
    setTimeout(() => setToast(""), 2000);
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-xl space-y-6 text-gray-800">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Course Categories</h2>
        <p className="text-sm text-gray-600">
          Organize courses by category
        </p>
      </div>

      {/* ADD CATEGORY */}
      <GlassCard>
        <div className="flex gap-3 mb-4">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="flex-1 p-3 rounded-xl bg-white/70 border"
          />
          <button
            onClick={addCategory}
            className="px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FaPlus />
          </button>
        </div>

        {/* CATEGORY LIST */}
        {categories.map((cat) => (
          <div
            key={cat}
            className="flex justify-between items-center
              bg-white/60 p-3 rounded-xl mb-2"
          >
            <span>{cat}</span>
            <button
              onClick={() => confirmDelete(cat)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </GlassCard>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        open={showModal}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory}"?`}
        onCancel={() => setShowModal(false)}
        onConfirm={deleteCategory}
      />

      {/* SUCCESS TOAST */}
      <Toast
        show={!!toast}
        message={toast}
        onClose={() => setToast("")}
      />
    </div>
  );
}

/* ================= GLASS CARD ================= */

const GlassCard = ({ children }) => (
  <div
    className="
      bg-white/40 backdrop-blur-[24px]
      border border-white/40
      rounded-3xl p-6
      shadow-[0_30px_90px_rgba(0,0,0,0.2)]
    "
  >
    {children}
  </div>
);
