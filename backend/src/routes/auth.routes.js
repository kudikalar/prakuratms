import express from "express";
import {
  adminLogin,
  educatorLogin,
  studentLogin,
  createAdmin,
  createEducator,
  createStudent,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* CREATE USERS */
router.post("/admin/create", createAdmin);
router.post("/educator/create", createEducator);
router.post("/student/create", createStudent);

/* LOGIN */
router.post("/admin/login", adminLogin);
router.post("/educator/login", educatorLogin);
router.post("/student/login", studentLogin);

export default router;
