import { z } from "zod";

const passwordSchema = z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(72, "Password must be at most 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1).max(72),
});

export const verifyEmailSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    code: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    code: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits"),
    newPassword: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
