import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import drinkRoutes from "./routes/drink.route.js";
import riceCurryRoutes from "./routes/riceCurry.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", drinkRoutes);
app.use("/api", riceCurryRoutes);
app.use("/api", orderRoutes);

// Error handler
app.use(errorHandler);

export default app;
