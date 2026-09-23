"use client";

import { useAuthStore } from "@/lib/auth/store/authStore";

export default function AdminPage() {
    const user = useAuthStore((s) => s.user);
    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Admin dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as {user?.email}</p>
        </div>
    );
}