import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { getStudentAttendance } from "../controllers/student.controller.js";

const router = express.Router();

router.get(
  "/attendance",
  protect,
  authorize("STUDENT"),
  getStudentAttendance
);

export default router;
