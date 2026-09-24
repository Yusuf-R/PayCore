import type { PrismaClient } from "../../generated/prisma/client.js";
import { prismaClient } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import type { FundWalletInput } from "./schema.js";
import { getTierLimits } from "../../config/limit.js";
import { AppError } from "../../lib/appError.js";

export class WalletService {
    constructor(private readonly prismaClient: PrismaClient) {}

    async getMyWallet(userId: string) {
        let wallet = await this.prismaClient.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            wallet = await this.prismaClient.wallet.create({
                data: {
                    userId,
                    currency: "NGN",
                    balanceFlat: 0n,
                },
            });
        }

        return {
            id: wallet.id,
            currency: wallet.currency,
            balanceFlat: wallet.balanceFlat.toString(),
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
            currency: result.wallet.currency,
            balanceFlat: result.wallet.balanceFlat.toString(),
        };
    }
}

export const walletService = new WalletService(prismaClient);