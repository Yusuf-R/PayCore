import winston from "winston";
import { config } from "../config/env.js";

const isDev = config.NODE_ENV === "development";

export const logger = winston.createLogger({
    level: isDev ? "debug" : "info",
    format: isDev
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: "HH:mm:ss" }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
                return `${timestamp} ${level}: ${message}${extra}`;
            }),
        )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
        ),
    transports: [new winston.transports.Console()],
});