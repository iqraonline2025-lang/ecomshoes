import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/adminController.js";

const router = express.Router();

// Get all orders
router.get("/orders", getAllOrders);

// Update status of a specific order
router.put("/orders/:id/status", updateOrderStatus);

export default router;