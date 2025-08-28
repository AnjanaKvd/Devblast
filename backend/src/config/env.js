import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/hackathon",
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173"
};
