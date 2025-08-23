import express from "express";
import { addRiceAndCurry, getRiceAndCurry } from "../controllers/meals.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/riceandcurry", getRiceAndCurry);
router.post("/riceandcurry", addRiceAndCurry);

export default router;
