import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client.js";
import {config} from "../config/env.js";

const adapter = new PrismaPg({
    connectionString: config.DATABASE_URL,
});

const logLevels = config.NODE_ENV === "development" ? (["query", "warn", "error"] as const) : (["error"] as const);

export const prismaClient = new PrismaClient({
    adapter,
    log: [...logLevels],
});