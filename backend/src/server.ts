import "dotenv/config";
import app from "./app.js";
import {config} from "./config/env.js";
import {prismaClient} from "./lib/prisma.js";
import {logger} from "./lib/logger.js";

async function start() {
    // Sanity check at startup: prove we can reach the DB
    await prismaClient.$connect();
    logger.info("Connected to Postgres Database")

    const server = app.listen(config.PORT, () => {
        logger.info(`Server running on http://localhost:${config.PORT}`);
    });

    function shutdown(signal: string) {
        logger.info(`${signal} received, shutting down...`);
        server.close(async () => {
            await prismaClient.$disconnect();
            logger.info("HTTP server closed, DB disconnected.");
            process.exit(0);
        });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
    logger.error("Failed to start server:", err);
    process.exit(1);
});