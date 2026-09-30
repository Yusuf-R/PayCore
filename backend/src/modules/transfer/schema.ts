import { z } from "zod";

export const createTransferSchema = z.object({
    recipientAccountNumber: z
        .string()
        .regex(/^\d{10}$/, "Recipient account number must be 10 digits"),

    amountFlat: z
        .string()
        .regex(/^\d+$/, "Amount must be a whole number (in minor units)")
        .refine((v) => BigInt(v) > 0n, "Amount must be greater than zero")
        .refine((v) => BigInt(v) < 10n ** 15n, "Amount is unrealistically large (typo guard)"),

    description: z.string().trim().max(200).optional(),
    pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;