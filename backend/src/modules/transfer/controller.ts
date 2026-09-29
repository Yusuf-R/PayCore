import type { Request, Response, NextFunction } from "express";
import { transferService } from "./service.js";
import { AppError } from "../../lib/appError.js";

export class TransferController {
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError("Authentication required", 401);

            const idempotencyKey = req.headers["idempotency-key"] as string;
            if (!idempotencyKey) throw new AppError("Idempotency-Key header required", 400);

            const result = await transferService.createTransfer(
                req.user.sub,
                req.body,
                idempotencyKey,
            );

            res.status(201).json({
                message: "Transfer completed",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError("Authentication required", 401);

            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

            const result = await transferService.listTransfers(req.user.sub, { page, limit });
            res.status(200).json({ data: result });
        } catch (err) {
            next(err);
        }
    };

    getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError("Authentication required", 401);

            const { id } = req.params;
            if (typeof id !== "string") throw new AppError("Transfer ID required", 400);

            const result = await transferService.getTransfer(req.user.sub, id);
            res.status(200).json({ data: result });
        } catch (err) {
            next(err);
        }
    };
}

export const transferController = new TransferController();