import express from "express";

import authRoutes from "./modules/user/presentation/auth.routes";
import { errorHandler } from "./common/middleware/error-handler";

const app = express();

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Central error handling middleware
app.use(errorHandler);

export default app;
