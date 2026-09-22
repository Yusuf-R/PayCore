// src/components/Marketing/ReceiptCard.tsx
"use client";

import { motion } from "motion/react";

export function ReceiptCard() {
    return (
        <motion.div
            className="relative w-full max-w-sm rotate-1 border border-(--line) bg-card p-6 shadow-sm"
            aria-hidden="true"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="flex items-center justify-between border-b border-dashed border-(--line) pb-4">
                <span className="font-serif text-sm font-semibold text-foreground">PayCore</span>
                <span className="font-mono-num text-xs text-muted-foreground">#TX-88214</span>
            </div>

            <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-mono-num text-foreground">Wallet •• 4471</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-mono-num text-foreground">Wallet •• 0093</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="flex items-center gap-1.5 font-mono-num text-primary">
            <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            Completed
          </span>
                </div>
            </div>

            <div className="mt-5 border-t border-dashed border-(--line) pt-4">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-mono-num text-2xl font-semibold text-foreground">₦25,000.00</span>
                </div>
            </div>

            <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-(--paper)" />
            <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-(--paper)" />
        </motion.div>
    );
}