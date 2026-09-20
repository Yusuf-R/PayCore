import bcrypt from "bcryptjs";
import type { PrismaClient } from "../../generated/prisma/client.js";
import type { VerificationCodeType } from "../../generated/prisma/enums.js";
import { prismaClient } from "../../lib/prisma.js";
import { config } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { AppError } from "../../lib/appError.js";
import {
    generateVerificationCode,
    hashVerificationCode,
    verifyVerificationCode,
} from "../../lib/verfifcationCode.js";
import { signAccessToken } from "../../lib/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../../lib/refreshToken.js";
import { REFRESH_TOKEN_TTL_MS } from "../../lib/cookies.js";
import type {
    RegisterInput,
    VerifyEmailInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    LoginInput, ResendVerificationInput,
} from "./schema.js";

const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000;

export class AuthService {
    constructor(private readonly prismaClient: PrismaClient) {}

    async register(input: RegisterInput) {
        const { email, password } = input;

        const existing = await this.prismaClient.user.findUnique({
            where: { email },
            select: { id: true, emailVerifiedAt: true, status: true },
        });

        if (existing?.emailVerifiedAt) {
            throw new AppError("Email already registered", 409);
        }

        const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

        const user = existing
            ? await this.prismaClient.user.update({
                where: { id: existing.id },
                data: { passwordHash },
            })
            : await this.prismaClient.user.create({
                data: {
                    email,
                    passwordHash,
                    status: "PENDING",
                },
            });

        await this.issueVerificationCode(user.id, user.email, "EMAIL_VERIFY");

        return { userId: user.id, email: user.email };
    }

    async verifyEmail(input: VerifyEmailInput) {
        const { email, code } = input;

        const user = await this.prismaClient.user.findUnique({
            where: { email },
            select: { id: true, emailVerifiedAt: true },
        });

        if (!user) {
            throw new AppError("Invalid or expired code", 400);
        }

        if (user.emailVerifiedAt) {
            throw new AppError("Email already verified", 400);
        }

        const codeRow = await this.prismaClient.verificationCode.findFirst({
            where: {
                userId: user.id,
                type: "EMAIL_VERIFY",
                usedAt: null,
            },
            orderBy: { createdAt: "desc" },
        });

        if (!codeRow) {
            throw new AppError("No active verification code. Please register again.", 400);
        }

        if (codeRow.expiresAt < new Date()) {
            throw new AppError("Code expired. Please register again.", 400);
        }

        const valid = await verifyVerificationCode(code, codeRow.codeHash);
        if (!valid) {
            throw new AppError("Invalid or expired code", 400);
        }

        await this.prismaClient.$transaction([
            this.prismaClient.verificationCode.update({
                where: { id: codeRow.id },
                data: { usedAt: new Date() },
            }),
            this.prismaClient.user.update({
                where: { id: user.id },
                data: {
                    emailVerifiedAt: new Date(),
                    status: "ACTIVE",
                },
            }),
        ]);

        return { userId: user.id, email };
    }

    async forgotPassword(input: ForgotPasswordInput) {
        const user = await this.prismaClient.user.findUnique({
            where: { email: input.email },
            select: { id: true, email: true, emailVerifiedAt: true },
        });

        if (user && user.emailVerifiedAt) {
            await this.issueVerificationCode(user.id, user.email, "PASSWORD_RESET");
        }

        return {
            message: "If that email exists, a password reset code has been sent.",
        };
    }

    async resetPassword(input: ResetPasswordInput) {
        const user = await this.prismaClient.user.findUnique({
            where: { email: input.email },
            select: { id: true, email: true },
        });

        if (!user) {
            throw new AppError("Invalid or expired code", 400);
        }

        const codeRow = await this.prismaClient.verificationCode.findFirst({
            where: {
                userId: user.id,
                type: "PASSWORD_RESET",
                usedAt: null,
            },
            orderBy: { createdAt: "desc" },
        });

        if (!codeRow) {
            throw new AppError("Invalid or expired code", 400);
        }

        if (codeRow.expiresAt < new Date()) {
            throw new AppError("Code expired. Please request a new one.", 400);
        }

        const valid = await verifyVerificationCode(input.code, codeRow.codeHash);
        if (!valid) {
            throw new AppError("Invalid or expired code", 400);
        }

        const passwordHash = await bcrypt.hash(input.newPassword, config.BCRYPT_ROUNDS);

        await this.prismaClient.$transaction([
            this.prismaClient.verificationCode.update({
                where: { id: codeRow.id },
                data: { usedAt: new Date() },
            }),
            this.prismaClient.user.update({
                where: { id: user.id },
                data: { passwordHash },
            }),
            this.prismaClient.refreshToken.updateMany({
                where: { userId: user.id, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);

        return { userId: user.id, email: user.email };
    }

    async login(
        input: LoginInput,
        meta: { userAgent?: string; ipAddress?: string },
    ) {
        const user = await this.prismaClient.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        if (!user.emailVerifiedAt) {
            throw new AppError("Please verify your email before logging in", 403);
        }

        if (user.status === "SUSPENDED") {
            throw new AppError("Account suspended. Contact support.", 403);
        }

        if (user.status === "CLOSED") {
            throw new AppError("Account closed.", 403);
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new AppError("Account temporarily locked. Try again later.", 423);
        }

        const passwordValid = await bcrypt.compare(input.password, user.passwordHash);

        if (!passwordValid) {
            const attempts = user.failedLoginAttempts + 1;
            const lockedUntil =
                attempts >= MAX_LOGIN_ATTEMPTS
                    ? new Date(Date.now() + LOGIN_LOCK_DURATION_MS)
                    : null;

            await this.prismaClient.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: attempts,
                    lockedUntil,
                },
            });

            throw new AppError("Invalid email or password", 401);
        }

        await this.prismaClient.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });

        const accessToken = signAccessToken(user.id, user.role);

        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashRefreshToken(refreshToken);

        await this.prismaClient.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
                userAgent: meta.userAgent,
                ipAddress: meta.ipAddress,
            },
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    async refresh(
        rawToken: string | undefined,
        meta: { userAgent?: string; ipAddress?: string },
    ) {
        if (!rawToken) {
            throw new AppError("Refresh token required", 401);
        }

        const tokenHash = hashRefreshToken(rawToken);

        const stored = await this.prismaClient.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });

        if (!stored) {
            throw new AppError("Invalid refresh token", 401);
        }

        if (stored.revokedAt) {
            // Token reuse — a revoked token is being presented.
            // Assume theft: kill every active token for this user.
            await this.prismaClient.refreshToken.updateMany({
                where: { userId: stored.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
            logger.warn("Refresh token reuse detected", { userId: stored.userId });
            throw new AppError("Invalid refresh token", 401);
        }

        if (stored.expiresAt < new Date()) {
            throw new AppError("Refresh token expired", 401);
        }

        if (stored.user.status !== "ACTIVE") {
            throw new AppError("Account not active", 403);
        }

        const newRawToken = generateRefreshToken();
        const newTokenHash = hashRefreshToken(newRawToken);

        await this.prismaClient.$transaction(async (tx) => {
            const created = await tx.refreshToken.create({
                data: {
                    userId: stored.userId,
                    tokenHash: newTokenHash,
                    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
                    userAgent: meta.userAgent,
                    ipAddress: meta.ipAddress,
                },
            });

            await tx.refreshToken.update({
                where: { id: stored.id },
                data: {
                    revokedAt: new Date(),
                    replacedByTokenId: created.id,
                },
            });

            return created;
        });

        const accessToken = signAccessToken(stored.userId, stored.user.role);

        return {
            accessToken,
            refreshToken: newRawToken,
            user: {
                id: stored.user.id,
                email: stored.user.email,
                role: stored.user.role,
            },
        };
    }

    async logout(rawToken: string | undefined): Promise<void> {
        if (!rawToken) return;

        const tokenHash = hashRefreshToken(rawToken);

        await this.prismaClient.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    async resendVerification(input: ResendVerificationInput) {
        const user = await this.prismaClient.user.findUnique({
            where: { email: input.email },
            select: { id: true, email: true, emailVerifiedAt: true },
        });

        if (user && !user.emailVerifiedAt) {
            await this.issueVerificationCode(user.id, user.email, "EMAIL_VERIFY");
        }

        return {
            message: "If that account exists and is unverified, a new code has been sent.",
        };
    }

    async getMe(userId: string) {
        const user = await this.prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true,
                status: true,
                kycStatus: true,
                emailVerifiedAt: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });

        if (!user) throw new AppError("User not found", 404);

        return user;
    }

    private async issueVerificationCode(
        userId: string,
        email: string,
        type: VerificationCodeType,
    ): Promise<void> {
        await this.prismaClient.verificationCode.deleteMany({
            where: { userId, type, usedAt: null },
        });

        const code = generateVerificationCode();
        const codeHash = await hashVerificationCode(code);

        await this.prismaClient.verificationCode.create({
            data: {
                userId,
                type,
                codeHash,
                expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
            },
        });

        if (config.NODE_ENV === "development") {
            logger.info(`📧 ${type} code (DEV ONLY)`, { email, code });
        }
    }


}

export const authService = new AuthService(prismaClient);