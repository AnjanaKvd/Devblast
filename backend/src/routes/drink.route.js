import express from "express";
import { getDrinks, addDrink, updateDrink, deleteDrink } from "../controllers/drink.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/drinks", getDrinks);
router.post("/add-drink", authMiddleware, addDrink);
router.post("/update-drink", authMiddleware, updateDrink);
router.post("/delete-drink", authMiddleware, deleteDrink);

export default router;