import mongoose from "mongoose";
import { seedDrinks } from "../utils/seedDrinks.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    
    // Seed initial data
    await seedDrinks();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
