import { createClient } from "redis";
import { config } from "../config/env.js";
import { logger } from "./logger.js";

export const redis = createClient({
    url: config.REDIS_URL,
});

redis.on("error", (err) => {
    logger.error("Redis client error", { error: err });
});