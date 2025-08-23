import express from "express";
import { getSnacks, addSnack, updateSnack, deleteSnack } from "../controllers/snack.controller.js";

const router = express.Router();

router.get("/snacks", getSnacks);
router.post("/add-snack", authMiddleware, addSnack);
router.post("/update-snack", authMiddleware, updateSnack);
router.post("/delete-snack", authMiddleware, deleteSnack);