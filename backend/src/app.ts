import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { AppError } from "./lib/appError.js";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Routes
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "paycore-api" });
});

app.get("/boom", () => {
    throw new AppError("This is a test error", 400);
});

app.get("/bug", () => {
    throw new Error("Something exploded");
});

// Error handler — MUST be last
app.use(errorHandler);

export default app;