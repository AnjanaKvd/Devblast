import express from "express";
import { getOrders, addOrder, updateOrder, deleteOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/orders", getOrders);
router.get("/orders/:id", getOrders);

// Protected routes
router.post("/orders", authMiddleware, addOrder);
router.post("/update-order", authMiddleware, updateOrder);
router.post("/update-order-status", authMiddleware, updateOrderStatus);
router.post("/delete-order", authMiddleware, deleteOrder);

export default router;
