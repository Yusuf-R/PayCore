"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Copy, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth/store/authStore";
import { useWallet } from "@/hooks/wallet/useWallet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIER_LABELS: Record<number, { label: string; description: string }> = {
    1: { label: "Tier 1", description: "Basic — verified email only" },
    2: { label: "Tier 2", description: "BVN verified" },
    3: { label: "Tier 3", description: "Full KYC" },
};

export function BalanceCard() {
    const user = useAuthStore((s) => s.user);
    const { data: wallet, isLoading, isError } = useWallet();
    const [hidden, setHidden] = useState(false);
    const [copied, setCopied] = useState(false);

    const tier = TIER_LABELS[(user as { tier?: number })?.tier ?? 1] ?? TIER_LABELS[1]!;

    async function copyAccountNumber() {
        if (!wallet?.accountNumber) return;
        try {
            await navigator.clipboard.writeText(wallet.accountNumber);
            setCopied(true);
            toast.success("Account number copied");
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Could not copy");
        }
    }

    const maskedBalance = "••••••";

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative p-6 lg:p-7">
                {/* ---------- Top row: label + eye toggle ---------- */}
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Available balance
                    </p>
                    <button
                        type="button"
                        onClick={() => setHidden((v) => !v)}
                        aria-label={hidden ? "Show balance" : "Hide balance"}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        {hidden ? (
                            <Eye className="h-4 w-4" />
                        ) : (
                            <EyeOff className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* ---------- Balance ---------- */}
                <div className="mt-3 flex items-baseline gap-2">
                    {isLoading ? (
                        <div className="h-11 w-52 animate-pulse rounded-md bg-muted" />
                    ) : isError || !wallet ? (
                        <p className="text-3xl font-extrabold tracking-tight text-muted-foreground">
                            Unavailable
                        </p>
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                                key={hidden ? "hidden" : "shown"}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: EASE }}
                                className={cn(
                                    "font-mono text-4xl font-bold tracking-tight tabular-nums",
                                    hidden && "tracking-[0.15em] text-muted-foreground",
                                )}
                            >
                                {hidden
                                    ? maskedBalance
                                    : formatMoney(wallet.balanceFlat, wallet.currency)}
                            </motion.p>
                        </AnimatePresence>
                    )}
                </div>

                {/* ---------- Welcome line ---------- */}
                <p className="mt-2 text-xs text-muted-foreground">
                    {user?.firstName
                        ? `Welcome back, ${user.firstName}.`
                        : "Welcome back."}
                </p>

                {/* ---------- Divider ---------- */}
                <div className="mt-6 border-t border-dashed border-border" />

                {/* ---------- Bottom row: account number + tier ---------- */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    {/* Account number */}
                    <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Account number
                        </p>
                        <button
                            type="button"
                            onClick={copyAccountNumber}
                            disabled={!wallet?.accountNumber}
                            className="group mt-1 flex items-center gap-2 text-left disabled:cursor-default"
                        >
              <span className="font-mono text-base font-semibold tracking-[0.15em] tabular-nums">
                {isLoading
                    ? "••••••••••"
                    : wallet?.accountNumber ?? "—"}
              </span>
                            {wallet?.accountNumber && (
                                <span className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-foreground">
                  {copied ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                  ) : (
                      <Copy className="h-3.5 w-3.5" />
                  )}
                </span>
                            )}
                        </button>
                    </div>

                    {/* Tier badge */}
                    <div className="flex flex-col items-end">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Account tier
                        </p>
                        <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-xs font-semibold text-primary">
                  {tier.label}
                </span>
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}