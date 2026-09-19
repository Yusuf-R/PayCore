import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";

export function generateVerificationCode(): string {
    const code = randomInt(0, 1_000_000);
    return code.toString().padStart(6, "0");
}

export async function hashVerificationCode(code: string): Promise<string> {
    return bcrypt.hash(code, config.BCRYPT_ROUNDS);
}

export async function verifyVerificationCode(
    code: string,
    codeHash: string,
): Promise<boolean> {
    return bcrypt.compare(code, codeHash);
}