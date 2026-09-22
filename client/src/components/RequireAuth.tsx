"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type AuthUser } from "@/lib/auth/authStore";

type Role = AuthUser["role"];

export function RequireAuth({
                                role,
                                children,
                            }: {
    role?: Role;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const status = useAuthStore((s) => s.status);
    const user = useAuthStore((s) => s.user);

    const isReady = status === "ready" && !!user;
    const hasRole = !role || user?.role === role;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }
        if (isReady && !hasRole) {
            // Authenticated but wrong role — send them to their own dashboard.
            router.replace(user?.role === "ADMIN" ? "/admin" : "/dashboard");
        }
    }, [status, isReady, hasRole, user?.role, router]);

    if (status === "idle" || status === "bootstrapping") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    Loading session…
                </div>
            </div>
        );
    }

    if (!isReady || !hasRole) return null;

    return <>{children}</>;
}