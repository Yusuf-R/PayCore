"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "@/schemas/AuthSchema";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {OTPInput} from "@/components/Marketing/OTPInput";
import { PasswordStrength } from "@/components/Marketing/PasswordStrength";

const EASE = [0.22, 1, 0.36, 1] as const;



function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const reset = useResetPassword();
    const [showPassword, setShowPassword] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const emailFromQuery = searchParams.get("email") ?? "";

    const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromQuery,
            code: "",
            newPassword: "",
        },
    });

    function onSubmit(values: ResetPasswordFormValues) {
        setSubmitAttempted(true);
        reset.mutate(values, {
            onError: (err) => {
                toast.error("Couldn't reset password", {
                    description:
                        err instanceof Error && err.message.includes("Invalid")
                            ? "The code is wrong or expired. Request a new one."
                            : "Please check your details and try again.",
                });
            },
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
        >
            <header>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step 2 of 2
                </p>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Set a new password.</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Enter the 6-digit code from your email and choose a new password.
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
                            <Label>Reset code</Label>
                            <OTPInput value={field.value ?? ""} onChange={field.onChange} error={!!fieldState.error} />
                            {fieldState.error && (
                                <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="newPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>New password</Label>
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    aria-invalid={!!fieldState.error}
                                    className="pr-16"
                                    {...field}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <PasswordStrength value={field.value ?? ""} showErrors={submitAttempted} />
                            {fieldState.error && submitAttempted && (
                                <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                <Button
                    type="submit"
                    disabled={reset.isPending}
                    className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20"
                >
                    {reset.isPending ? "Resetting password…" : "Reset password"}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Didn&#39;t get a code?{" "}
                <Link
                    href={`/forgot-password`}
                    className="font-medium text-primary hover:underline"
                >
                    Request a new one
                </Link>
            </p>
        </motion.div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}