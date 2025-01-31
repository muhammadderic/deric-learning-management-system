// src/config/env.ts
import dotenv from "dotenv";
import path from "path";

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
};
