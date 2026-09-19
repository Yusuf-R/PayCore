import type { Request, Response, NextFunction } from "express";
import { authService } from "./service.js";
import {
    REFRESH_COOKIE_NAME,
    REFRESH_TOKEN_TTL_MS,
    refreshCookieOptions,
} from "../../lib/cookies.js";
// import { AppError } from "../../lib/appError.js";

export class AuthController {
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                message: "Registration successful. Check your email for a verification code.",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    };

    verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.verifyEmail(req.body);
            res.status(200).json({
                message: "Email verified successfully.",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.forgotPassword(req.body);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.resetPassword(req.body);
            res.status(200).json({
                message: "Password reset successful. Please log in with your new password.",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await authService.login(req.body, {
                userAgent: req.headers["user-agent"],
                ipAddress: req.ip,
            });

            res
                .status(200)
                .cookie(
                    REFRESH_COOKIE_NAME,
                    result.refreshToken,
                    refreshCookieOptions(REFRESH_TOKEN_TTL_MS),
                )
                .json({
                    message: "Login successful",
                    data: {
                        accessToken: result.accessToken,
                        user: result.user,
                    },
                });
        } catch (err) {
            next(err);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

            const result = await authService.refresh(rawToken, {
                userAgent: req.headers["user-agent"],
                ipAddress: req.ip,
            });

            res
                .status(200)
                .cookie(
                    REFRESH_COOKIE_NAME,
                    result.refreshToken,
                    refreshCookieOptions(REFRESH_TOKEN_TTL_MS),
                )
                .json({
                    message: "Token refreshed",
                    data: {
                        accessToken: result.accessToken,
                        user: result.user,
                    },
                });
        } catch (err) {
            next(err);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
            await authService.logout(rawToken);

            res
                .status(200)
                .clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions(0))
                .json({ message: "Logged out" });
        } catch (err) {
            next(err);
        }
    };
}

export const authController = new AuthController();