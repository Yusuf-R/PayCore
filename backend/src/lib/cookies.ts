import { config } from "../config/env.js";

export const REFRESH_COOKIE_NAME = "refreshToken";
export const REFRESH_COOKIE_PATH = "/api/v1/auth";
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function refreshCookieOptions(maxAgeMs: number) {
    return {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: REFRESH_COOKIE_PATH,
        maxAge: maxAgeMs,
    };
}