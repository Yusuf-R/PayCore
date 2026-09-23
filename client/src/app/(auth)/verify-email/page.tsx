"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
    verifyEmailSchema,
    type VerifyEmailFormValues,
} from "@/schemas/AuthSchema";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { useResendVerification } from "@/hooks/useResendVerification";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {useVerifyFlowStore} from "@/lib/auth/store/verifyFlowStore";
import {useAuthStore} from "@/lib/auth/store/authStore";
import {useRouter} from "next/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;
const RESEND_COOLDOWN_SECONDS = 45;

function VerifyEmailForm() {
    const router = useRouter();
    const verify = useVerifyEmail();
    const resend = useResendVerification();


    // set email from store to be of type string
    const emailFromStore = useVerifyFlowStore((s) => s.email) as string | null;
    const [welcome, setWelcome] = useState(false);

    const [cooldown, setCooldown] = useState(0);
    const sentOnMountRef = useRef(false);

    const { control, handleSubmit, getValues, setError } = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { email: emailFromStore ?? "", code: "" },
    });

    // Countdown for the resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // If someone lands here without an email in the URL, nothing to do —
    // but we still let them type it manually.
    useEffect(() => {
        if (!sentOnMountRef.current && emailFromStore) {
            sentOnMountRef.current = true;
            setCooldown(RESEND_COOLDOWN_SECONDS);
        }
    }, [emailFromStore]);

    function onSubmit(values: VerifyEmailFormValues) {
        verify.mutate(values, {
            onSuccess: () => {
                setWelcome(true);
                const role = useAuthStore.getState().user?.role;
                setTimeout(() => {
                    router.push(role === "ADMIN" ? "/admin" : "/dashboard");
                }, 1400);
            },
            onError: (err) => {
                const message =
                    err instanceof Error && err.message.toLowerCase().includes("expired")
                        ? "That code has expired. Request a new one."
                        : "That code is wrong or has expired.";

                toast.error("Verification failed", { description: message });
                setError("code", { type: "manual", message: "Invalid or expired code" });
            },
        });
    }

    function onResend() {
        const email = getValues("email");
        resend.mutate(
            { email },
            {
                onSuccess: () => {
                    setCooldown(RESEND_COOLDOWN_SECONDS);
                    toast.success("New code sent", {
                        description: `Check ${email} for a fresh 6-digit code.`,
                    });
                },
                onError: () => {
                    toast.error("Couldn't resend the code", {
                        description: "Please try again in a moment.",
                    });
                },
            },
        );
    }

    if (welcome) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15"
                >
                    <svg
                        width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="text-primary"
                    >
                        <path d="m5 12 5 5L20 7" />
                    </svg>
                </motion.div>

                <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
                    You&apos;re in.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Taking you to your dashboard…
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
        >
            <header>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Almost there
                </p>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                    Verify your email.
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We sent a 6-digit code
                    {emailFromStore && (
                        <>
                            {" "}to{" "}
                            <span className="font-medium text-foreground">{emailFromStore}</span>
                        </>
                    )}
                    . It expires in 10 minutes.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Email</Label>
                            <Input
                                id={field.name}
                                type="email"
                                autoComplete="email"
                                aria-invalid={!!fieldState.error}
                                {...field}
                            />
                            {fieldState.error && (
                                <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="code"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={field.name}>Verification code</Label>
                                <button
                                    type="button"
                                    disabled={resend.isPending || cooldown > 0}
                                    onClick={onResend}
                                    className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {resend.isPending
                                        ? "Sending…"
                                        : cooldown > 0
                                            ? `Resend in ${cooldown}s`
                                            : "Resend code"}
                                </button>
                            </div>
                            <Input
                                id={field.name}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="000000"
                                maxLength={6}
                                autoFocus
                                aria-invalid={!!fieldState.error}
                                className="font-mono tracking-[0.4em] text-lg"
                                {...field}
                            />
                            {fieldState.error && (
                                <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                <Button
                    type="submit"
                    disabled={verify.isPending}
                    className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20"
                >
                    {verify.isPending ? "Verifying…" : "Verify email"}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Wrong email?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Register again
                </Link>
            </p>
        </motion.div>
    );
}



export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailForm />
        </Suspense>
    );
}