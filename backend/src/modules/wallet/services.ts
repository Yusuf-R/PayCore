import type { PrismaClient } from "../../generated/prisma/client.js";
import { prismaClient } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import type { FundWalletInput } from "./schema.js";
import {getTierLimits} from "../../config/limit.js";
import {AppError} from "../../lib/appError.js";

export class WalletService {
    constructor(private readonly prismaClient: PrismaClient) {}

    async getMyWallet(userId: string) {
        // Lazy-create on first access — handles users registered before wallets existed
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

        const wallet = await this.prismaClient.wallet.upsert({
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

        logger.info("Wallet funded", {
            userId,
            walletId: wallet.id,
            amountFlat: amount.toString(),
        });

        return {
            id: wallet.id,
            currency: wallet.currency,
            balanceFlat: wallet.balanceFlat.toString(),
        };
    }
}

export const walletService = new WalletService(prismaClient);