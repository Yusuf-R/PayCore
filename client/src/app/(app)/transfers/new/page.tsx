"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccountLookup, useSendTransfer } from "@/hooks/transfer/useTransfer";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useAuthStore } from "@/lib/auth/store/authStore";
import { formatMoney, toFlatUnits } from "@/lib/money";
import type { AccountLookup } from "@/services/transfer/TransferService";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

type Step = "details" | "pin" | "confirm" | "success";

export default function NewTransferPage() {
    const router = useRouter();
    const wallet = useWallet();
    const lookup = useAccountLookup();
    const send = useSendTransfer();
    const currentUser = useAuthStore((s) => s.user);

    const [step, setStep] = useState<Step>("details");
    const [accountNumber, setAccountNumber] = useState("");
    const [recipient, setRecipient] = useState<AccountLookup | null>(null);
    const [lookupError, setLookupError] = useState<string | null>(null);
    const [amountMajor, setAmountMajor] = useState("");
    const [description, setDescription] = useState("");
    const [pin, setPin] = useState("");
    const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
    const [result, setResult] = useState<{ id: string; amountFlat: string } | null>(null);

    // Debounced inline account lookup
    useEffect(() => {
        setRecipient(null);
        setLookupError(null);

        if (accountNumber.length !== 10) return;

        const t = setTimeout(() => {
            lookup.mutate(accountNumber, {
                onSuccess: (data) => {
                    setRecipient(data);
                    setLookupError(null);
                },
                onError: () => {
                    setRecipient(null);
                    setLookupError("Account not found");
                },
            });
        }, 400);

        return () => clearTimeout(t);
    }, [accountNumber]);

    const canContinue = !!recipient && /^\d+(\.\d{1,2})?$/.test(amountMajor) && Number(amountMajor) > 0;

    function onDetailsContinue(e: React.FormEvent) {
        e.preventDefault();
        if (!canContinue) {
            toast.error("Enter a valid amount");
            return;
        }
        if (!currentUser?.pinSetAt) {
            toast.error("Set a transaction PIN first", {
                description: "You'll be redirected to security settings.",
            });
            setTimeout(() => router.push("/settings/security"), 900);
            return;
        }
        setStep("pin");
    }

    function onPinContinue(e: React.FormEvent) {
        e.preventDefault();
        if (!/^\d{4}$/.test(pin)) {
            toast.error("PIN must be 4 digits");
            return;
        }
        setStep("confirm");
    }

    function onConfirm() {
        if (!recipient) return;
        send.mutate(
            {
                input: {
                    recipientAccountNumber: recipient.accountNumber,
                    amountFlat: toFlatUnits(amountMajor, recipient.currency),
                    pin,
                    ...(description.trim() && { description: description.trim() }),
                },
                idempotencyKey,
            },
            {
                onSuccess: (data) => {
                    setResult({ id: data.id, amountFlat: data.amountFlat });
                    setStep("success");
                },
                onError: (err) => {
                    const msg = err instanceof Error ? err.message : "Transfer failed";
                    if (msg.toLowerCase().includes("pin")) {
                        toast.error("Incorrect PIN");
                        setPin("");
                        setStep("pin");
                    } else {
                        toast.error(msg);
                    }
                },
            },
        );
    }

    function startOver() {
        setStep("details");
        setAccountNumber("");
        setRecipient(null);
        setAmountMajor("");
        setDescription("");
        setPin("");
        setResult(null);
        setIdempotencyKey(crypto.randomUUID());
    }

    return (
        <div className="mx-auto max-w-2xl p-6 lg:p-8">
            <PageHeader
                title="Send money"
                description="Transfer to any PayCore account."
                actions={
                    step !== "success" ? (
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/transfers">
                                <ArrowLeft className="mr-1 h-4 w-4" /> Back
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {/* -------- STEP 1: Recipient + Amount -------- */}
                    {step === "details" && (
                        <motion.form
                            key="details"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            onSubmit={onDetailsContinue}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="account">Recipient account number</Label>
                                <div className="relative">
                                    <Input
                                        id="account"
                                        inputMode="numeric"
                                        maxLength={10}
                                        autoFocus
                                        placeholder="0123456789"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                        className="font-mono text-lg tracking-widest"
                                    />
                                    {lookup.isPending && (
                                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                    )}
                                    {recipient && (
                                        <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                                    )}
                                </div>

                                {/* Inline recipient preview */}
                                <AnimatePresence>
                                    {recipient && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25, ease: EASE }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                                                <p className="text-sm font-medium">{recipient.accountName}</p>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    {recipient.accountNumber} · {recipient.currency}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                    {lookupError && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-xs text-destructive"
                                        >
                                            {lookupError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
                    {recipient?.currency === "NGN" ? "₦" : ""}
                  </span>
                                    <Input
                                        id="amount"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={amountMajor}
                                        onChange={(e) => setAmountMajor(e.target.value.replace(/[^\d.]/g, ""))}
                                        className="pl-9 font-mono text-2xl tabular-nums"
                                    />
                                </div>

                                {/* Quick amount chips */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {QUICK_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setAmountMajor(String(amt))}
                                            className={cn(
                                                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                                amountMajor === String(amt)
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                                            )}
                                        >
                                            ₦{amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                {wallet.data && (
                                    <p className="pt-1 text-xs text-muted-foreground">
                                        Available: {formatMoney(wallet.data.balanceFlat, wallet.data.currency)}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note">Note (optional)</Label>
                                <Input
                                    id="note"
                                    maxLength={200}
                                    placeholder="What's this for?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={!canContinue} className="w-full" size="lg">
                                Continue
                            </Button>
                        </motion.form>
                    )}

                    {/* -------- STEP 2: PIN -------- */}
                    {step === "pin" && (
                        <motion.form
                            key="pin"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            onSubmit={onPinContinue}
                            className="space-y-5"
                        >
                            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    Enter your 4-digit transaction PIN to authorise this transfer.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pin">Transaction PIN</Label>
                                <Input
                                    id="pin"
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    autoFocus
                                    placeholder="••••"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                                    className="text-center font-mono text-2xl tracking-[0.5em]"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep("details")}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={pin.length !== 4}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Continue
                                </Button>
                            </div>
                        </motion.form>
                    )}

                    {/* -------- STEP 3: Confirm -------- */}
                    {step === "confirm" && recipient && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="space-y-5"
                        >
                            <div className="rounded-xl border border-border bg-background p-4">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Recipient</p>
                                <p className="mt-1 font-medium">{recipient.accountName}</p>
                                <p className="font-mono text-xs text-muted-foreground">
                                    {recipient.accountNumber} · {recipient.currency}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-muted/30 p-5">
                                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    You are sending
                                </p>
                                <p className="mt-3 font-mono text-4xl font-bold tabular-nums">
                                    {formatMoney(toFlatUnits(amountMajor, recipient.currency), recipient.currency)}
                                </p>
                                {description.trim() && (
                                    <p className="mt-3 text-sm text-muted-foreground">Note: {description}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep("pin")}
                                    disabled={send.isPending}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={send.isPending}
                                    className="flex-1"
                                    size="lg"
                                >
                                    {send.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                                        </>
                                    ) : (
                                        "Confirm & send"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* -------- STEP 4: Success -------- */}
                    {step === "success" && result && recipient && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="flex flex-col items-center text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15"
                            >
                                <Check className="h-8 w-8 text-primary" />
                            </motion.div>

                            <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
                                Transfer complete.
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {recipient.accountName} received{" "}
                                <span className="font-mono font-medium text-foreground">
                  {formatMoney(result.amountFlat, recipient.currency)}
                </span>
                            </p>

                            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                                <Button asChild variant="outline" className="flex-1" size="lg">
                                    <Link href={`/transfers/${result.id}`}>View receipt</Link>
                                </Button>
                                <Button onClick={startOver} className="flex-1" size="lg">
                                    Send another
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}