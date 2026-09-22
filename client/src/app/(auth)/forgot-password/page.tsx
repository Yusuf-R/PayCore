"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
    forgotPasswordSchema,
    type ForgotPasswordFormValues,
} from "@/schemas/AuthSchema";
import { useForgotPassword } from "@/hooks/useForgotPassword";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ForgotPasswordPage() {
    const forgot = useForgotPassword();

    const { control, handleSubmit, getValues } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    function onSubmit(values: ForgotPasswordFormValues) {
        forgot.mutate(values, {
            onError: () => {
                toast.error("Something went wrong", {
                    description: "Please try again in a moment.",
                });
            },
        });
    }

    if (forgot.isSuccess) {
        const email = getValues("email");
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
            >
                <header>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                        Step 1 of 2
                    </p>
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Check your inbox.</h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        If an account exists for <span className="font-medium text-foreground">{email}</span>,
                        we've sent a 6-digit code. It expires in 10 minutes.
                    </p>
                </header>

                <Button
                    asChild
                    className="mt-10 h-11 w-full text-base font-semibold shadow-md shadow-primary/20"
                >
                    <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
                        Enter code
                    </Link>
                </Button>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Didn't get it?{" "}
                    <button
                        type="button"
                        onClick={() => forgot.reset()}
                        className="font-medium text-primary hover:underline"
                    >
                        Try a different email
                    </button>
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
                    Step 1 of 2
                </p>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Forgot password?</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Enter the email on your account. We'll send a code to reset it.
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
                                autoFocus
                                placeholder="you@example.com"
                                aria-invalid={!!fieldState.error}
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
                    disabled={forgot.isPending}
                    className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20"
                >
                    {forgot.isPending ? "Sending code…" : "Send reset code"}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Remembered it?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Back to log in
                </Link>
            </p>
        </motion.div>
    );
}