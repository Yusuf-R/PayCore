import "dotenv/config";
import app from "./app.js";
import { config } from "./config/env.js";

const PORT = config.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown — respond to signals from Docker/Kubernetes
function shutdown(signal: string) {
    console.log(`${signal} received, shutting down...`);
    server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));