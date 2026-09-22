// src/components/dashboard/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    History,
    ShieldCheck,
    ChevronsLeft,
    ChevronsRight,
    PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarMode = "expanded" | "icon-only" | "hidden";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
    { href: "/dashboard/transfer", label: "Send money", icon: ArrowLeftRight },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
];

export function Sidebar() {
    const [mode, setMode] = useState<SidebarMode>("expanded");
    const pathname = usePathname();

    if (mode === "hidden") {
        return (
            <button
                onClick={() => setMode("expanded")}
                className="fixed left-4 top-4 z-20 rounded border border-[var(--line)] bg-[var(--paper)] p-2"
                aria-label="Show sidebar"
            >
                <ChevronsRight className="h-4 w-4" />
            </button>
        );
    }

    const isIconOnly = mode === "icon-only";

    return (
        <aside
            className={cn(
                "flex h-screen flex-col border-r border-[var(--line)] bg-[var(--paper)] transition-[width] duration-200",
                isIconOnly ? "w-16" : "w-60"
            )}
        >
            <div className={cn("flex items-center border-b border-[var(--line)] px-4 py-4", isIconOnly && "justify-center px-0")}>
                {!isIconOnly && <span className="font-serif text-lg font-semibold text-[var(--ink)]">PayCore</span>}
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={isIconOnly ? label : undefined}
                            className={cn(
                                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                                isIconOnly && "justify-center px-0",
                                active
                                    ? "bg-[var(--ledger)]/10 text-[var(--ledger)] font-medium"
                                    : "text-[var(--muted)] hover:bg-[var(--ink)]/5 hover:text-[var(--ink)]"
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isIconOnly && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className={cn("flex items-center gap-1 border-t border-[var(--line)] p-2", isIconOnly && "flex-col")}>
                <button
                    onClick={() => setMode(isIconOnly ? "expanded" : "icon-only")}
                    className="rounded p-2 text-[var(--muted)] hover:bg-[var(--ink)]/5"
                    aria-label="Toggle sidebar width"
                >
                    {isIconOnly ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                </button>
                {!isIconOnly && (
                    <button
                        onClick={() => setMode("hidden")}
                        className="rounded p-2 text-[var(--muted)] hover:bg-[var(--ink)]/5"
                        aria-label="Hide sidebar"
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                )}
            </div>
        </aside>
    );
}