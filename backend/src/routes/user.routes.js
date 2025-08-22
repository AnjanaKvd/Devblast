import express from "express";
import { getProfile, changePassword, changeEmail, changeName } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.post("/change-password", authMiddleware, changePassword);
router.post("/change-email", authMiddleware, changeEmail);
router.post("/change-name", authMiddleware, changeName);

export default router;
