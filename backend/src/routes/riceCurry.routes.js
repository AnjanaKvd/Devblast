import express from "express";
import { getRiceCurries, addRiceCurry, updateRiceCurry, deleteRiceCurry } from "../controllers/riceCurry.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/rice-curries", getRiceCurries);
router.post("/add-rice-curry", authMiddleware, addRiceCurry);
router.post("/update-rice-curry", authMiddleware, updateRiceCurry);
router.post("/delete-rice-curry", authMiddleware, deleteRiceCurry);

export default router;