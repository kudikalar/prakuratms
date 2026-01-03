import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

import { createBatch } from "../controllers/batch.controller.js";
import { assignEducatorToBatch } from "../controllers/batchAllocation.controller.js";
import { enrollStudent } from "../controllers/enrollment.controller.js";

const router = express.Router();

router.post("/batches", protect, authorize("ADMIN"), createBatch);
router.post("/allocate-educator", protect, authorize("ADMIN"), assignEducatorToBatch);
router.post("/enroll-student", protect, authorize("ADMIN"), enrollStudent);

export default router;
