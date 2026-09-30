"use client";

import {use} from "react";
import Link from "next/link";
import {ArrowLeft, Check, X, Clock, ArrowUpRight, ArrowDownLeft} from "lucide-react";
import {PageHeader} from "@/components/Dashboard/PageHeader";
import {Button} from "@/components/ui/button";
import {useTransferDetail} from "@/hooks/transfer/useTransfer";
import {formatMoney} from "@/lib/money";
import {cn} from "@/lib/utils";

const STATUS_META = {
    COMPLETED: {icon: Check, color: "text-primary", bg: "bg-primary/10", label: "Completed"},
    PENDING: {icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Pending"},
    FAILED: {icon: X, color: "text-destructive", bg: "bg-destructive/10", label: "Failed"},
    REVERSED: {icon: X, color: "text-destructive", bg: "bg-destructive/10", label: "Reversed"},
} as const;

export default function TransferDetailPage({
                                               params,
                                           }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = use(params);
    const {data: tx, isLoading} = useTransferDetail(id);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-xl p-6 lg:p-8">
                <div className="h-64 animate-pulse rounded-2xl bg-muted"/>
            </div>
        );
    }

    if (!tx) {
        return (
            <div className="mx-auto max-w-xl p-6 lg:p-8">
                <PageHeader title="Transfer not found"/>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/transfers">
                        <ArrowLeft className="mr-1 h-4 w-4"/> Back to transfers
                    </Link>
                </Button>
            </div>
        );
    }

    const meta = STATUS_META[tx.status];
    const StatusIcon = meta.icon;
    const isOut = tx.direction === "OUT";

    return (
        <div className="mx-auto max-w-xl p-6 lg:p-8">
            <PageHeader
                title="Receipt"
                actions={
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/transfers">
                            <ArrowLeft className="mr-1 h-4 w-4"/> Back
                        </Link>
                    </Button>
                }
            />

            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background">
                {/* Status header */}
                <div className="flex flex-col items-center border-b border-dashed border-border px-6 py-8">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-full", meta.bg)}>
                        <StatusIcon className={cn("h-6 w-6", meta.color)}/>
                    </div>
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {meta.label}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                        {isOut ? (
                            <ArrowUpRight className="h-5 w-5 text-destructive"/>
                        ) : (
                            <ArrowDownLeft className="h-5 w-5 text-primary"/>
                        )}
                        <p className="font-mono text-4xl font-bold tabular-nums">
                            {isOut ? "-" : "+"}
                            {formatMoney(tx.amountFlat, tx.currency)}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4 px-6 py-6">
                    <Row label="Type" value={tx.type}/>
                    {tx.fromAccountNumber && (
                        <Row label="From" value={tx.fromAccountNumber} mono/>
                    )}
                    {tx.toAccountNumber && (
                        <Row label="To" value={tx.toAccountNumber} mono/>
                    )}
                    <Row label="Currency" value={tx.currency}/>
                    {tx.description && <Row label="Note" value={tx.description}/>}
                    <Row label="Created" value={new Date(tx.createdAt).toLocaleString()}/>
                    {tx.completedAt && (
                        <Row label="Completed" value={new Date(tx.completedAt).toLocaleString()}/>
                    )}
                    <Row label="Reference" value={tx.id} mono small/>
                </div>
            </div>
        </div>
    );
}

function Row({
                 label,
                 value,
                 mono,
                 small,
             }: {
    label: string;
    value: string;
    mono?: boolean;
    small?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span
                className={cn(
                    "text-right",
                    mono && "font-mono",
                    small && "text-xs break-all",
                )}
            >
        {value}
      </span>
        </div>
    );
}