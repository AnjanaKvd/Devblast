import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000"
};
