"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useAuthStore } from "@/lib/auth/store/authStore";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/admin", label: "Overview", icon: OverviewIcon, exact: true },
    { href: "/admin/users", label: "Users", icon: UsersIcon },
    { href: "/admin/transactions", label: "Transactions", icon: TransferIcon },
    { href: "/admin/audit", label: "Audit log", icon: AuditIcon },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-foreground/[0.03] lg:flex">
            <Link href="/admin" className="flex items-center gap-2 px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground font-mono text-sm font-bold text-background shadow-sm">
          P
        </span>
                <span className="text-lg font-bold tracking-tight">PayCore</span>
                <span className="ml-1 rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Admin
        </span>
            </Link>

            <nav className="mt-4 flex-1 space-y-0.5 px-3">
                {NAV.map((item) => {
                    const active = item.exact
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                            )}
                        >
                            {active && (
                                <motion.span
                                    layoutId="admin-sidebar-active"
                                    className="absolute inset-y-1.5 -left-3 w-0.5 rounded-full bg-foreground"
                                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                            )}
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border p-3">
                <div className="flex items-center gap-3 rounded-md px-2 py-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-bold uppercase text-background">
                        {user?.email?.[0] ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">
                            {user?.firstName ?? "Admin"}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard"
                    className="mt-2 block w-full rounded-md px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                    Switch to user view
                </Link>
                <button
                    type="button"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-60"
                >
                    {logout.isPending ? "Signing out…" : "Sign out"}
                </button>
            </div>
        </aside>
    );
}

/* ---------- Icons ---------- */

function OverviewIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function TransferIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 8h13" />
            <path d="m14 5 3 3-3 3" />
            <path d="M20 16H7" />
            <path d="m10 19-3-3 3-3" />
        </svg>
    );
}

function AuditIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8" />
            <path d="M8 17h5" />
        </svg>
    );
}