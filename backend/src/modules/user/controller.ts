import type { Request, Response, NextFunction } from "express";
import { userService } from "./service.js";
import { AppError } from "../../lib/appError.js";

export class UserController {
    updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new AppError("Authentication required", 401);
            const user = await userService.updateProfile(req.user.sub, req.body);
            res.status(200).json({
                message: "Profile updated",
                data: user,
            });
        } catch (err) {
            next(err);
        }
    };
}

export const userController = new UserController();