import { randomInt } from "node:crypto";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { prismaClient } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import type { FundWalletInput } from "./schema.js";
import { getTierLimits } from "../../config/limit.js";
import { AppError } from "../../lib/appError.js";

function generateAccountNumber(): string {
    const first = randomInt(1, 10);
    const rest = randomInt(0, 1_000_000_000).toString().padStart(9, "0");
    return `${first}${rest}`;
}

function isUniqueViolation(err: unknown, field: string): boolean {
    return (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "P2002" &&
        JSON.stringify((err as { meta?: unknown }).meta).includes(field)
    );
}

export class WalletService {
    constructor(private readonly prismaClient: PrismaClient) {}

    async getMyWallet(userId: string) {
        let wallet = await this.prismaClient.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            wallet = await this.createWalletWithAccountNumber(userId);
        }

        return {
            id: wallet.id,
            accountNumber: wallet.accountNumber,
            currency: wallet.currency,
            balanceFlat: wallet.balanceFlat.toString(),
        };
    }

    async createWalletWithAccountNumber(userId: string) {
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                return await this.prismaClient.wallet.create({
                    data: {
                        userId,
                        accountNumber: generateAccountNumber(),
                        currency: "NGN",
                    },
                });
            } catch (err) {
                if (isUniqueViolation(err, "account_number")) continue;
                throw err;
            }
        }
        throw new Error("Could not generate unique account number");
    }

    async lookupAccount(accountNumber: string) {
        const wallet = await this.prismaClient.wallet.findUnique({
            where: { accountNumber },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true },
                },
            },
        });

        if (!wallet) throw new AppError("Account not found", 404);

        const name =
            [wallet.user.firstName, wallet.user.lastName].filter(Boolean).join(" ") ||
            wallet.user.email.split("@")[0];

        return {
            accountNumber: wallet.accountNumber,
            accountName: name!,
            currency: wallet.currency,
        };
    }

    async fundWallet(userId: string, input: FundWalletInput) {
        const amount = BigInt(input.amountFlat);

        const user = await this.prismaClient.user.findUnique({
            where: { id: userId },
            select: { tier: true },
        });

        if (!user) throw new AppError("User not found", 404);

        const limits = getTierLimits(user.tier);
        if (amount > limits.singleTransactionFlat) {
            throw new AppError(
                `Amount exceeds your ${limits.label} single-transaction limit`,
                403,
            );
        }

        const result = await this.prismaClient.$transaction(async (tx) => {
            const wallet = await tx.wallet.upsert({
                where: { userId },
                create: {
                    userId,
                    accountNumber: generateAccountNumber(),
                    currency: "NGN",
                    balanceFlat: amount,
                },
                update: {
                    balanceFlat: { increment: amount },
                },
            });

            const transaction = await tx.transaction.create({
                data: {
                    type: "FUNDING",
                    status: "COMPLETED",
                    toWalletId: wallet.id,
                    amountFlat: amount,
                    currency: wallet.currency,
                    description: "Wallet funding (simulated deposit)",
                    completedAt: new Date(),
                },
            });

            return { wallet, transaction };
        });

        logger.info("Wallet funded", {
            userId,
            walletId: result.wallet.id,
            transactionId: result.transaction.id,
            amountFlat: amount.toString(),
        });

        return {
            id: result.wallet.id,
            accountNumber: result.wallet.accountNumber,
            currency: result.wallet.currency,
            balanceFlat: result.wallet.balanceFlat.toString(),
        };
    }
}

export const walletService = new WalletService(prismaClient);