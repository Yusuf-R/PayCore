import type { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis.js";
import { AppError } from "../lib/appError.js";
import { logger } from "../lib/logger.js";

interface RateLimitOptions {
    windowSeconds: number;
    max: number;
    keyPrefix?: string;
}

export function rateLimit(options: RateLimitOptions) {
    const { windowSeconds, max, keyPrefix = "ratelimit" } = options;

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const identifier = req.ip ?? "unknown";
        const window = Math.floor(Date.now() / (windowSeconds * 1000));
        const key = `${keyPrefix}:${identifier}:${window}`;

        try {
            const count = await redis.incr(key);

            if (count === 1) {
                await redis.expire(key, windowSeconds);
            }

            const ttl = await redis.ttl(key);

            res.setHeader("X-RateLimit-Limit", max.toString());
            res.setHeader("X-RateLimit-Remaining", Math.max(0, max - count).toString());
            res.setHeader("X-RateLimit-Reset", (ttl > 0 ? ttl : 0).toString());

            if (count > max) {
                logger.warn("Rate limit exceeded", { identifier, key, count, max });
                throw new AppError("Too many requests. Please try again later.", 429);
            }

            next();
        } catch (err) {
            if (err instanceof AppError) {
                next(err);
                return;
            }
            // Redis is down — fail open (allow the request)
            logger.error("Rate limiter unavailable", { error: err });
            next();
        }
    };
}