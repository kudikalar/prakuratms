import express from "express";
import {
  getAllPayments,
  addPayment,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/", getAllPayments);
router.post("/add", addPayment);
router.delete("/:paymentId", deletePayment);

export default router;
