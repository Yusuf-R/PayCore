import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(1, "Password is required").max(72),
});

export const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    code: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits"),
    newPassword: passwordSchema,
});

export const verifyEmailSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    code: z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});



export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;