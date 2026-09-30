"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";
import { motion } from "motion/react";
import { useTransferHistory } from "@/hooks/transfer/useTransfer";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function RecentTransactions() {
    const { data, isLoading } = useTransferHistory(1, 5);

    return (
        <div className="rounded-2xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
                <Link
                    href="/transfers"
                    className="text-xs font-medium text-primary hover:underline"
                >
                    View all
                </Link>
            </div>

            {isLoading && (
                <ul className="divide-y divide-border">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="flex items-center gap-4 px-6 py-4">
                            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                            </div>
                            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && data && data.items.length === 0 && (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium">No transactions yet</p>
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                        Once you send or receive money, your activity will appear here.
                    </p>
                </div>
            )}

            {!isLoading && data && data.items.length > 0 && (
                <ul className="divide-y divide-border">
                    {data.items.map((tx, i) => {
                        const isOut = tx.direction === "OUT";
                        return (
                            <motion.li
                                key={tx.id}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                            >
                                <Link
                                    href={`/transfers/${tx.id}`}
                                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                                >
                                    <div
                                        className={cn(
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                            isOut
                                                ? "bg-destructive/10 text-destructive"
                                                : "bg-primary/10 text-primary",
                                        )}
                                    >
                                        {isOut ? (
                                            <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownLeft className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {tx.type === "FUNDING"
                                                ? "Wallet funding"
                                                : isOut
                                                    ? `To ${tx.toAccountNumber}`
                                                    : `From ${tx.fromAccountNumber}`}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <p
                                        className={cn(
                                            "shrink-0 font-mono text-sm font-semibold tabular-nums",
                                            isOut ? "text-destructive" : "text-primary",
                                        )}
                                    >
                                        {isOut ? "-" : "+"}
                                        {formatMoney(tx.amountFlat, tx.currency)}
                                    </p>
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}