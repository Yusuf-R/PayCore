import "dotenv/config";
import app from "./app.js";
import {config} from "./config/env.js";
import {prismaClient} from "./lib/prisma.js";

async function start() {
    // Sanity check at startup: prove we can reach the DB
    await prismaClient.$queryRaw`SELECT 1`;
    console.log("✅ Connected to Postgres");

    const server = app.listen(config.PORT, () => {
        console.log(`Server running on http://localhost:${config.PORT}`);
    });

    function shutdown(signal: string) {
        console.log(`${signal} received, shutting down...`);
        server.close(async () => {
            await prismaClient.$disconnect();
            console.log("HTTP server closed, DB disconnected.");
            process.exit(0);
        });
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});