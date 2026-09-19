import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/appError.js";
import { logger } from "../lib/logger.js";
import { config } from "../config/env.js";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
): void {
    const isAppError = err instanceof AppError;
    const statusCode = isAppError ? err.statusCode : 500;
    const isOperational = isAppError ? err.isOperational : false;
    const message =
        isAppError && isOperational ? err.message : "Internal server error";

    const logMeta = {
        method: req.method,
        path: req.path,
        statusCode,
        ...(err instanceof Error ? { error: err } : { err }),
    };

    if (isOperational) {
        logger.warn("Handled error", logMeta);
    } else {
        logger.error("Unhandled error", logMeta);
    }

    const body =
        config.NODE_ENV === "development"
            ? { error: message, ...(err instanceof Error && { stack: err.stack }) }
            : { error: message };

    res.status(statusCode).json(body);
}