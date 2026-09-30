import type { PrismaClient } from "../../generated/prisma/client.js";
import { prismaClient } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import { AppError } from "../../lib/appError.js";
import type { UpdateProfileInput } from "./schema.js";

function isUniqueViolation(err: unknown, field: string): boolean {
    return (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "P2002" &&
        JSON.stringify((err as { meta?: unknown }).meta).includes(field)
    );
}

export class UserService {
    constructor(private readonly prismaClient: PrismaClient) {}

    async updateProfile(userId: string, input: UpdateProfileInput) {
        try {
            const user = await this.prismaClient.user.update({
                where: { id: userId },
                data: {
                    ...(input.firstName !== undefined && { firstName: input.firstName }),
                    ...(input.lastName !== undefined && { lastName: input.lastName }),
                    ...(input.phone !== undefined && { phone: input.phone === "" ? null : input.phone }),
                },
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
                    tier: true,
                    pinSetAt: true,
                },
            });

            logger.info("Profile updated", { userId });

            return user;
        } catch (err) {
            if (isUniqueViolation(err, "phone")) {
                throw new AppError("Phone number is already in use", 409);
            }
            throw err;
        }
    }
}

export const userService = new UserService(prismaClient);