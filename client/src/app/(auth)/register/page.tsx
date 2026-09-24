"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "@/schemas/AuthSchema";
import { useRegister } from "@/hooks/auth/useRegister";
import { PasswordStrength } from "@/components/Marketing/PasswordStrength";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EASE = [0.22, 1, 0.36, 1] as const;


export default function RegisterPage() {
    const register = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: "", password: "" },
    });

    const password = watch("password") ?? "";

    function onSubmit(values: RegisterFormValues) {
        setSubmitAttempted(true);
        register.mutate(values, {
            onError: () => {
                toast.error("Registration failed", {
                    description: "Please check your details and try again.",
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
                <h1 className="text-3xl font-extrabold tracking-tight">Open an account.</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Takes a minute. Verify your email to activate your wallet.
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

                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Password</Label>

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
                        </div>
                    )}
                />

                <Button
                    type="submit"
                    disabled={register.isPending}
                    className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20"
                >
                    {register.isPending ? "Creating your account…" : "Create account"}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Log in
                </Link>
            </p>
        </motion.div>
    );
}