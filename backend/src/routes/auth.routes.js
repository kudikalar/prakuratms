import express from "express";

/* ================= AUTH CONTROLLERS ================= */
import {
  adminLogin,
  educatorLogin,
  studentLogin,
  createAdmin,
  createEducator,
  createStudent,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
} from "../controllers/auth.controller.js";

/* ================= COURSE CONTROLLERS ================= */
import {
  createCourse,
  updateCourse,
  getAllCourses,
  deleteCourse, // 🆕 ADD THIS (DO NOT REMOVE OTHERS)
} from "../controllers/course.controller.js";

/* ================= MIDDLEWARE ================= */
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   AUTH & USER MANAGEMENT
===================================================== */

/* CREATE USERS */
router.post("/admin/create", createAdmin);
router.post("/educator/create", createEducator);
router.post("/student/create", createStudent);

/* LOGIN */
router.post("/admin/login", adminLogin);
router.post("/educator/login", educatorLogin);
router.post("/student/login", studentLogin);

/* ADMIN USER MANAGEMENT */
router.get("/admin/users", protect, authorize("ADMIN"), getAllUsers);
router.get("/admin/users/:id", protect, authorize("ADMIN"), getUserById);
router.put("/admin/users/:id", protect, authorize("ADMIN"), updateUser);
router.patch(
  "/admin/users/:id/status",
  protect,
  authorize("ADMIN"),
  toggleUserStatus
);

/* =====================================================
   ADMIN COURSES
===================================================== */

/* 📥 LIST COURSES */
router.get(
  "/admin/courses",
  protect,
  authorize("ADMIN"),
  getAllCourses
);

/* ➕ CREATE COURSE */
router.post(
  "/admin/courses",
  protect,
  authorize("ADMIN"),
  createCourse
);

/* ✏️ UPDATE COURSE */
router.put(
  "/admin/courses/:id",
  protect,
  authorize("ADMIN"),
  updateCourse
);

/* 🗑️ DELETE COURSE (SOFT DELETE) — 🔥 THIS FIXES YOUR ISSUE */
router.delete(
  "/admin/courses/:id",
  protect,
  authorize("ADMIN"),
  deleteCourse
);

export default router;
