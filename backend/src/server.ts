import "dotenv/config";
import app from "./app.js";
import { config } from "./config/env.js";
import { prismaClient } from "./lib/prisma.js";
import { redis } from "./lib/redis.js";
import { logger } from "./lib/logger.js";


async function start() {
    await prismaClient.$connect();
    logger.info("✅ Connected to Postgres");

    await redis.connect();
    const pong = await redis.ping();
    logger.info(`✅ Connected to Redis (PING → ${pong})`);

    const server = app.listen(config.PORT, () => {
        logger.info(`Server running on http://localhost:${config.PORT}`);
    });

    function shutdown(signal: string) {
        logger.info(`${signal} received, shutting down...`);
        server.close(async () => {
            await prismaClient.$disconnect();
            await redis.quit();
            logger.info("HTTP server closed, DB and Redis disconnected.");
            process.exit(0);
        });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
    logger.error("Failed to start server:", err instanceof Error ? err.message : err);
    process.exit(1);
});