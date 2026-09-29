import { z } from "zod";

export const fundWalletSchema = z.object({
    amountFlat: z
        .string()
        .regex(/^\d+$/, "Amount must be a whole number (in minor units)")
        .refine((v) => BigInt(v) > 0n, "Amount must be greater than zero")
        .refine((v) => BigInt(v) < 10n ** 15n, "Amount is unrealistically large (typo guard)"),
});

export const accountNumberParamSchema = z.object({
    accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});

export type FundWalletInput = z.infer<typeof fundWalletSchema>;
export type AccountNumberParam = z.infer<typeof accountNumberParamSchema>;
