import express from "express";
import { getOrders, addOrder, updateOrder, deleteOrder } from "../controllers/drink.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/orders", getOrders);
router.post("/add-order", authMiddleware, addOrder);
router.post("/update-order", authMiddleware, updateOrder);
router.post("/delete-order", authMiddleware, deleteOrder);

export default router;