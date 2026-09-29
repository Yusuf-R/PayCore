import { createHash } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { prismaClient } from "../lib/prisma.js";
import { redis } from "../lib/redis.js";
import { logger } from "../lib/logger.js";
import { AppError } from "../lib/appError.js";
import { Prisma } from "../generated/prisma/client.js";

const LOCK_TTL_MS = 30_000;
const KEY_TTL_SECONDS = 24 * 60 * 60;

function sha256(value: string): string {
    return createHash("sha256").update(value).digest("hex");
}

function canonicalize(value: unknown): unknown {
    if (value === null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(canonicalize);
    const sorted: Record<string, unknown> = {};
    for (const k of Object.keys(value as object).sort()) {
        sorted[k] = canonicalize((value as Record<string, unknown>)[k]);
    }
    return sorted;
}

interface CachedResponse {
    status: number;
    body: unknown;
    requestHash: string;
}

function cacheKeyFor(userId: string, endpoint: string, key: string): string {
    return `idem:${userId}:${endpoint}:${key}`;
}

export function idempotent(endpoint: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const key = req.headers["idempotency-key"] as string | undefined;

            if (!key) throw new AppError("Idempotency-Key header required", 400);
            if (!/^[a-zA-Z0-9_-]{16,64}$/.test(key)) {
                throw new AppError("Invalid idempotency key format", 400);
            }
            if (!req.user) throw new AppError("Authentication required", 401);

            const userId = req.user.sub;
            const requestHash = sha256(JSON.stringify(canonicalize(req.body)));
            const cacheKey = cacheKeyFor(userId, endpoint, key);

            // ---------- 1. Redis fast path (cache only, never truth) ----------
            try {
                const cached = await redis.get(cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached) as CachedResponse;
                    if (parsed.requestHash !== requestHash) {
                        throw new AppError("Idempotency key reused with different request body", 422);
                    }
                    res
                        .status(parsed.status)
                        .setHeader("Idempotency-Replayed", "true")
                        .json(parsed.body);
                    return;
                }
            } catch (err) {
                if (err instanceof AppError) throw err;
                // Redis down → fall through to DB. Never fail the request because cache is unavailable.
                logger.warn("Idempotency Redis read failed, falling back to DB", { err });
            }

            // ---------- 2. DB (source of truth) ----------
            const existing = await prismaClient.idempotencyKey.findUnique({
                where: { userId_endpoint_key: { userId, endpoint, key } },
            });

            if (existing) {
                if (existing.requestHash !== requestHash) {
                    throw new AppError("Idempotency key reused with different request body", 422);
                }

                if (existing.completedAt) {
                    const payload: CachedResponse = {
                        status: existing.responseStatus!,
                        body: existing.responseBody,
                        requestHash,
                    };
                    // Warm cache for next time. Fire-and-forget.
                    redis.set(cacheKey, JSON.stringify(payload), {"EX": KEY_TTL_SECONDS}).catch(() => {});

                    res
                        .status(existing.responseStatus!)
                        .setHeader("Idempotency-Replayed", "true")
                        .json(existing.responseBody);
                    return;
                }

                if (existing.lockedAt && Date.now() - existing.lockedAt.getTime() < LOCK_TTL_MS) {
                    throw new AppError("Request with this idempotency key is in progress", 409);
                }
                // Stale lock → fall through and re-lock below
            }

            // ---------- 3. Lock the key (DB unique constraint is the lock) ----------
            await prismaClient.idempotencyKey.upsert({
                where: { userId_endpoint_key: { userId, endpoint, key } },
                create: {
                    userId,
                    endpoint,
                    key,
                    requestHash,
                    lockedAt: new Date(),
                    expiresAt: new Date(Date.now() + KEY_TTL_SECONDS * 1000),
                },
                update: {
                    requestHash,
                    lockedAt: new Date(),
                    responseStatus: null,
                    responseBody: Prisma.JsonNull,
                    completedAt: null,
                },
            });

            // ---------- 4. Store 2xx responses ----------
            const originalJson = res.json.bind(res);
            res.json = (body: unknown) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const status = res.statusCode;
                    const data = (body as { data?: { id?: string; transactionId?: string } }).data;
                    const resourceId = data?.id ?? data?.transactionId ?? null;

                    // DB first, Redis second. Never the other way round.
                    prismaClient.idempotencyKey
                        .update({
                            where: { userId_endpoint_key: { userId, endpoint, key } },
                            data: {
                                responseStatus: status,
                                responseBody: body as object,
                                completedAt: new Date(),
                                resourceId,
                            },
                        })
                        .then(() => {
                            const payload: CachedResponse = { status, body, requestHash };
                            return redis
                                .set(cacheKey, JSON.stringify(payload), {"EX": KEY_TTL_SECONDS})
                                .catch((err) => logger.warn("Failed to warm idempotency cache", { err }));
                        })
                        .catch((err) => logger.error("Failed to store idempotent response", { err }));
                }

                return originalJson(body);
            };

            next();
        } catch (err) {
            next(err);
        }
    };
}