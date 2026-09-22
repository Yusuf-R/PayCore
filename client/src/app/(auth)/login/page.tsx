"use client";

import Link from "next/link";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {motion} from "motion/react";
import {toast} from "sonner";
import {loginSchema, type LoginFormValues} from "@/schemas/AuthSchema";
import {useLogin} from "@/hooks/useLogin";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
    const login = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {control, handleSubmit} = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: "", password: ""},
    });

    function onSubmit(values: LoginFormValues) {
        login.mutate(values, {
            onError: () => {
                toast.error("Login failed", {
                    description: "Check your email and password and try again.",
                });
            },
        });
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: EASE}}
        >
            <header>
                <h1 className="text-3xl font-extrabold tracking-tight">Welcome back.</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Log in to access your wallet and transfers.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
                <Controller
                    name="email"
                    control={control}
                    render={({field, fieldState}) => (
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
                    render={({field, fieldState}) => (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={field.name}>Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
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
                            {fieldState.error && (
                                <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                <Button type="submit" disabled={login.isPending}
                        className="h-11 w-full text-base font-semibold shadow-md shadow-primary/20">
                    {login.isPending ? (
                        <span className="flex items-center gap-2">
                            <motion.span
                                className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
                                animate={{opacity: [1, 0.3, 1]}}
                                transition={{duration: 0.8, repeat: Infinity}}
                            />
                            Logging in…
                        </span>
                    ) : (
                        "Log in"
                    )}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Open one
                </Link>
            </p>
        </motion.div>
    );
}