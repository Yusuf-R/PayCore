"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Plus, Receipt } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { useTransferHistory } from "@/hooks/transfer/useTransfer";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TransfersPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useTransferHistory(page, 20);

    return (
        <div className="mx-auto max-w-6xl p-6 lg:p-8">
            <PageHeader
                title="Transfers"
                description="Money in, money out."
                actions={
                    <Button asChild size="sm">
                        <Link href="/transfers/new">
                            <Plus className="mr-1 h-4 w-4" /> Send
                        </Link>
                    </Button>
                }
            />

            <div className="mt-8">
                {isLoading && <ListSkeleton />}

                {!isLoading && data && data.items.length === 0 && <EmptyState />}

                {!isLoading && data && data.items.length > 0 && (
                    <>
                        <div className="overflow-hidden rounded-2xl border border-border bg-background">
                            <ul className="divide-y divide-border">
                                {data.items.map((tx, i) => {
                                    const isOut = tx.direction === "OUT";
                                    return (
                                        <motion.li
                                            key={tx.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.02, ease: EASE }}
                                        >
                                            <Link
                                                href={`/transfers/${tx.id}`}
                                                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
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
                                                        {tx.description ? ` · ${tx.description}` : ""}
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
                        </div>

                        {data.total > data.limit && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Page {data.page} of {Math.ceil(data.total / data.limit)}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= Math.ceil(data.total / data.limit)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <ul className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-4 px-5 py-4">
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-40 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-56 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-border bg-background px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Receipt className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No transfers yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
                Send money to another PayCore account to get started.
            </p>
            <Button asChild className="mt-6" size="sm">
                <Link href="/transfers/new">Send money</Link>
            </Button>
        </div>
    );
}