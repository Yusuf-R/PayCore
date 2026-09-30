import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./modules/auth/router.js";
import { walletRouter } from "./modules/wallet/router.js";
import cookieParser from "cookie-parser";
import {transferRouter} from "./modules/transfer/router.js";
import {userRouter} from "./modules/user/router.js";


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
app.use("/api/v1/wallets", walletRouter);
app.use("/api/v1/transfers", transferRouter);
app.use("/api/v1/users", userRouter);

// Error handler — MUST be last
app.use(errorHandler);

export default app;