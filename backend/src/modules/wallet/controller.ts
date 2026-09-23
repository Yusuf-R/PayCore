import type { Request, Response, NextFunction } from "express";
import { walletService } from "./services.js";
import { AppError } from "../../lib/appError.js";

export class WalletController {
    getMyWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError("Authentication required", 401);
            const wallet = await walletService.getMyWallet(req.user.sub);
            res.status(200).json({ data: wallet });
        } catch (err) {
            next(err);
        }
    };

    fundWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError("Authentication required", 401);
            const wallet = await walletService.fundWallet(req.user.sub, req.body);
            res.status(200).json({
                message: "Wallet funded",
                data: wallet,
            });
        } catch (err) {
            next(err);
        }
    };
}

export const walletController = new WalletController();