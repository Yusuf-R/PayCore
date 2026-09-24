"use client";

import { motion } from "motion/react";
import { Receipt } from "lucide-react";

export function RecentTransactions() {
    return (
        <div className="rounded-2xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Coming soon
        </span>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center px-6 py-16 text-center"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">No transactions yet</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                    Once you send or receive money, your activity will appear here.
                </p>
            </motion.div>
        </div>
    );
}