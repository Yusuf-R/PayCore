"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFundWallet } from "@/hooks/wallet/useWallet";

const EASE = [0.22, 1, 0.36, 1] as const;
const QUICK_AMOUNTS = [1000, 5000, 10000, 50000];

export function FundWalletModal({
                                    open,
                                    onClose,
                                }: {
    open: boolean;
    onClose: () => void;
}) {
    const fund = useFundWallet();
    const [amount, setAmount] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = amount.trim();
        if (!/^\d+(\.\d{1,2})?$/.test(trimmed) || Number(trimmed) <= 0) {
            toast.error("Enter a valid amount");
            return;
        }
        // Convert major units (naira) to minor units (kobo)
        const [whole, fraction = ""] = trimmed.split(".");
        const flat = `${whole}${fraction.padEnd(2, "0").slice(0, 2)}`;

        fund.mutate(flat, {
            onSuccess: () => {
                toast.success("Wallet funded");
                setAmount("");
                onClose();
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : "Could not fund wallet");
            },
        });
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold tracking-tight">Fund your wallet</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add money to your NGN balance.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (₦)</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                    className="text-lg font-mono tabular-nums"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {QUICK_AMOUNTS.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(String(amt))}
                                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                                    >
                                        ₦{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={onClose} disabled={fund.isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={fund.isPending}>
                                    {fund.isPending ? "Funding…" : "Fund wallet"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}