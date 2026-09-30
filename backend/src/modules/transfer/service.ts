import type { PrismaClient } from "../../generated/prisma/client.js";
import { prismaClient } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import { AppError } from "../../lib/appError.js";
import { getTierLimits } from "../../config/limit.js";
import type { CreateTransferInput } from "./schema.js";
import bcrypt from "bcryptjs";

export class TransferService {
    constructor(private readonly prismaClient: PrismaClient) {}

    async createTransfer(
        userId: string,
        input: CreateTransferInput,
        idempotencyKey: string,
    ) {
        const amount = BigInt(input.amountFlat);

        // ---------- 1. Load sender user (single query) ----------
        const senderUser = await this.prismaClient.user.findUnique({
            where: { id: userId },
            select: { tier: true, pinHash: true, pinSetAt: true },
        });

        if (!senderUser) throw new AppError("User not found", 404);

        if (!senderUser.pinHash || !senderUser.pinSetAt) {
            throw new AppError("Set a transaction PIN before sending money", 403);
        }

        const pinValid = await bcrypt.compare(input.pin, senderUser.pinHash);
        if (!pinValid) {
            throw new AppError("Invalid PIN", 401);
        }

        // ---------- 2. Load sender wallet ----------
        const senderWallet = await this.prismaClient.wallet.findUnique({
            where: { userId },
            select: { id: true, currency: true, balanceFlat: true },
        });

        if (!senderWallet) {
            throw new AppError("Sender wallet not found", 404);
        }

        // ---------- 3. Load receiver wallet ----------
        const receiverWallet = await this.prismaClient.wallet.findUnique({
            where: { accountNumber: input.recipientAccountNumber },
            select: { id: true, userId: true, currency: true },
        });

        if (!receiverWallet) {
            throw new AppError("Recipient account not found", 404);
        }

        if (senderWallet.id === receiverWallet.id) {
            throw new AppError("Cannot transfer to yourself", 400);
        }

        if (senderWallet.currency !== receiverWallet.currency) {
            throw new AppError("Currency mismatch between wallets", 400);
        }

        // ---------- 4. Tier limit ----------
        const limits = getTierLimits(senderUser.tier);
        if (amount > limits.singleTransactionFlat) {
            throw new AppError(
                `Amount exceeds your ${limits.label} single-transaction limit`,
                403,
            );
        }

        // ---------- 5. Atomic transfer ----------
        try {
            const result = await this.prismaClient.$transaction(async (tx) => {
                const debited = await tx.$executeRaw`
        UPDATE wallets
        SET balance_flat = balance_flat - ${amount},
            updated_at = NOW()
        WHERE id = ${senderWallet.id}::uuid
          AND balance_flat >= ${amount}
      `;

                if (debited === 0) {
                    throw new AppError("Insufficient funds", 400);
                }

                await tx.wallet.update({
                    where: { id: receiverWallet.id },
                    data: { balanceFlat: { increment: amount } },
                });

                const transaction = await tx.transaction.create({
                    data: {
                        type: "TRANSFER",
                        status: "COMPLETED",
                        fromWalletId: senderWallet.id,
                        toWalletId: receiverWallet.id,
                        amountFlat: amount,
                        currency: senderWallet.currency,
                        idempotencyKey,
                        description: input.description,
                        completedAt: new Date(),
                    },
                });

                const updatedSender = await tx.wallet.findUnique({
                    where: { id: senderWallet.id },
                    select: { balanceFlat: true },
                });

                return {
                    transaction,
                    newBalance: updatedSender!.balanceFlat,
                };
            });

            logger.info("Transfer completed", {
                userId,
                transactionId: result.transaction.id,
                fromWalletId: senderWallet.id,
                toWalletId: receiverWallet.id,
                amountFlat: amount.toString(),
            });

            return {
                id: result.transaction.id,
                status: result.transaction.status,
                amountFlat: result.transaction.amountFlat.toString(),
                currency: result.transaction.currency,
                recipientAccountNumber: input.recipientAccountNumber,
                newBalanceFlat: result.newBalance.toString(),
                completedAt: result.transaction.completedAt,
            };
        } catch (err) {
            logger.error("Transfer failed", { userId, error: err });
            throw err;
        }
    }

    async listTransfers(
        userId: string,
        opts: { page: number; limit: number },
    ) {
        const wallet = await this.prismaClient.wallet.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!wallet) {
            return { items: [], page: opts.page, limit: opts.limit, total: 0 };
        }

        const where = {
            OR: [
                { fromWalletId: wallet.id },
                { toWalletId: wallet.id },
            ],
        };

        const [rows, total] = await Promise.all([
            this.prismaClient.transaction.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (opts.page - 1) * opts.limit,
                take: opts.limit,
                include: {
                    fromWallet: { select: { accountNumber: true } },
                    toWallet: { select: { accountNumber: true } },
                },
            }),
            this.prismaClient.transaction.count({ where }),
        ]);

        const items = rows.map((tx) => ({
            id: tx.id,
            type: tx.type,
            status: tx.status,
            direction: tx.fromWalletId === wallet.id ? "OUT" : "IN",
            amountFlat: tx.amountFlat.toString(),
            currency: tx.currency,
            description: tx.description,
            fromAccountNumber: tx.fromWallet?.accountNumber ?? null,
            toAccountNumber: tx.toWallet?.accountNumber ?? null,
            createdAt: tx.createdAt,
            completedAt: tx.completedAt,
        }));

        return { items, page: opts.page, limit: opts.limit, total };
    }

    async getTransfer(userId: string, transferId: string) {
        const wallet = await this.prismaClient.wallet.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!wallet) throw new AppError("Wallet not found", 404);

        const tx = await this.prismaClient.transaction.findUnique({
            where: { id: transferId },
            include: {
                fromWallet: { select: { accountNumber: true } },
                toWallet: { select: { accountNumber: true } },
            },
        });

        if (!tx) throw new AppError("Transfer not found", 404);

        // Only the sender or receiver can see this transfer
        if (tx.fromWalletId !== wallet.id && tx.toWalletId !== wallet.id) {
            throw new AppError("Transfer not found", 404);
        }

        return {
            id: tx.id,
            type: tx.type,
            status: tx.status,
            direction: tx.fromWalletId === wallet.id ? "OUT" : "IN",
            amountFlat: tx.amountFlat.toString(),
            currency: tx.currency,
            description: tx.description,
            fromAccountNumber: tx.fromWallet?.accountNumber ?? null,
            toAccountNumber: tx.toWallet?.accountNumber ?? null,
            createdAt: tx.createdAt,
            completedAt: tx.completedAt,
        };
    }
}

export const transferService = new TransferService(prismaClient);