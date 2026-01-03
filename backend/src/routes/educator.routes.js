import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getEducatorBatches } from "../controllers/batchAllocation.controller.js";

const router = express.Router();

router.get("/my-batches", protect, authorize("EDUCATOR"), getEducatorBatches);

export default router;
