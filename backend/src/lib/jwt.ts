import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config/env.js";
import { AppError } from "./appError.js";

export interface AccessTokenPayload {
    sub: string;
    role: string;
    type: "access";
}

export function signAccessToken(userId: string, role: string): string {
    const options: SignOptions = {
        expiresIn: config.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(
        { sub: userId, role, type: "access" },
        config.JWT_ACCESS_SECRET,
        options,
    );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    let decoded: string | jwt.JwtPayload;

    try {
        decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new AppError("Access token expired", 401);
        }
        if (err instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid access token", 401);
        }
        throw err;
    }

    if (
        typeof decoded === "string" ||
        typeof decoded.sub !== "string" ||
        typeof decoded.role !== "string" ||
        decoded.type !== "access"
    ) {
        throw new AppError("Malformed access token", 401);
    }

    return {
        sub: decoded.sub,
        role: decoded.role,
        type: "access",
    };
}