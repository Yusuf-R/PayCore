import { z } from "zod";
import { normalizeNigerianPhone } from "../../lib/validators/phone.js";

const phoneSchema = z
    .string()
    .trim()
    .transform((v) => normalizeNigerianPhone(v))
    .refine((v) => v !== null, "Enter a valid Nigerian phone number (e.g. +234 706 851 8999)")
    .transform((v) => v as string);

export const updateProfileSchema = z.object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
    phone: phoneSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;