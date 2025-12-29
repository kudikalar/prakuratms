import express from "express";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= COURSE ROUTES ================= */
router.post(
  "/admin/courses",
  protect,
  authorize("ADMIN"),
  createCourse
);

router.get(
  "/admin/courses",
  protect,
  authorize("ADMIN"),
  getAllCourses
);

router.put(
  "/admin/courses/:id",
  protect,
  authorize("ADMIN"),
  updateCourse
);

router.delete(
  "/admin/courses/:id",
  protect,
  authorize("ADMIN"),
  deleteCourse
);

export default router;
