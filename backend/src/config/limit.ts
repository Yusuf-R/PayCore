export interface TierLimits {
    label: string;
    singleTransactionFlat: bigint;
    dailyTotalFlat: bigint;
}

/**
 * Per-tier transaction limits, in minor units (kobo for NGN).
 * Tier 1: unverified — phone/email only
 * Tier 2: BVN verified
 * Tier 3: full KYC (ID + address)
 */
export const TIER_LIMITS: Record<number, TierLimits> = {
    1: {
        label: "Tier 1",
        singleTransactionFlat: 50_000_00n,      // ₦50,000
        dailyTotalFlat: 300_000_00n,             // ₦300,000
    },
    2: {
        label: "Tier 2",
        singleTransactionFlat: 200_000_00n,     // ₦200,000
        dailyTotalFlat: 1_000_000_00n,           // ₦1,000,000
    },
    3: {
        label: "Tier 3",
        singleTransactionFlat: 5_000_000_00n,   // ₦5,000,000
        dailyTotalFlat: 10_000_000_00n,          // ₦10,000,000
    },
};

export function getTierLimits(tier: number): TierLimits {
    return TIER_LIMITS[tier] ?? TIER_LIMITS[1]!;
}