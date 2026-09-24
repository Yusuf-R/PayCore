"use client";

import { motion } from "motion/react";
import { useAuthStore } from "@/lib/auth/store/authStore";
import { useWallet } from "@/hooks/wallet/useWallet";
import { formatMoney } from "@/lib/money";

export function BalanceCard() {
    const user = useAuthStore((s) => s.user);
    const { data: wallet, isLoading, isError } = useWallet();

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

            <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Available balance
                </p>

                <div className="mt-4 flex items-baseline gap-3">
                    {isLoading ? (
                        <div className="h-12 w-48 animate-pulse rounded-md bg-muted" />
                    ) : isError || !wallet ? (
                        <p className="text-3xl font-extrabold tracking-tight text-muted-foreground">
                            Unavailable
                        </p>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="font-mono text-4xl font-bold tracking-tight tabular-nums"
                        >
                            {formatMoney(wallet.balanceFlat, wallet.currency)}
                        </motion.p>
                    )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                    {user?.firstName ? `Welcome back, ${user.firstName}.` : "Welcome back."}
                </p>
            </div>
        </div>
    );
}