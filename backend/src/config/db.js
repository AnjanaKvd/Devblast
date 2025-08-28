import mongoose from "mongoose";
import { seedDrinks } from "../utils/seedDrinks.js";
import { ENV } from "./env.js";

const { MONGO_URI } = ENV;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
    
    // Seed initial data
    await seedDrinks();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
