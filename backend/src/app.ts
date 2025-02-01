import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/user/presentation/auth.routes";
import { errorHandler } from "./common/middleware/error-handler";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Central error handling middleware
app.use(errorHandler);

export default app;
