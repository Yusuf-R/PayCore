import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./modules/auth/routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "paycore-api" });
});

// Auth
app.use("/api/v1/auth", authRouter);

// Error handler — MUST be last
app.use(errorHandler);

export default app;