import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import mealRoutes from "./routes/meal.routs.js";
import imageRoutes from "./routes/image.rout.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", imageRoutes);
// Error handler
app.use(errorHandler);

export default app;
