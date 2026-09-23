"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuthStore } from "@/lib/auth/store/authStore";
import { useUIStore } from "@/lib/store/ui/uiStore";
import { SignOutDialog } from "./SignOutDialog";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/dashboard", label: "Overview", icon: OverviewIcon },
    { href: "/wallets", label: "Wallets", icon: WalletIcon },
    { href: "/transfers", label: "Transfers", icon: TransferIcon },
    { href: "/notifications", label: "Notifications", icon: BellIcon },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function UserSidebar() {
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);
    const { sidebarMode, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useUIStore();
    const [signOutOpen, setSignOutOpen] = useState(false);

    const collapsed = sidebarMode === "collapsed";

    const renderSidebar = (isCollapsed: boolean) => (
        <div className="flex h-full flex-col">
            {/* Brand + collapse toggle */}
            <div className={cn("flex items-center gap-2 px-4 py-5", isCollapsed && "justify-center px-2")}>
                <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30">
            P
          </span>
                    {!isCollapsed && <span className="text-lg font-bold tracking-tight">PayCore</span>}
                </Link>
                {!isCollapsed && (
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Collapse sidebar"
                        className="ml-auto hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground lg:flex"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isCollapsed && (
                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Expand sidebar"
                    className="mx-auto mb-2 hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground lg:flex"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            )}

            {/* Nav */}
            <nav className="flex-1 space-y-0.5 px-2">
                {NAV.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            title={isCollapsed ? item.label : undefined}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isCollapsed && "justify-center px-2",
                                active
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                            )}
                        >
                            {active && (
                                <motion.span
                                    layoutId="user-sidebar-active"
                                    className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                            )}
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer: user + sign out */}
            <div className="border-t border-border p-2">
                <div className={cn("flex items-center gap-3 rounded-md px-2 py-2", isCollapsed && "justify-center px-0")}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold uppercase text-primary">
                        {user?.email?.[0] ?? "?"}
                    </div>
                    {!isCollapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                                {user?.firstName ?? user?.email?.split("@")[0] ?? "Account"}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
                        </div>
                    )}
                </div>
                <div className={cn("mt-2 flex items-center gap-1", isCollapsed ? "flex-col" : "justify-between px-1")}>
                    <button
                        type="button"
                        onClick={() => setSignOutOpen(true)}
                        title={isCollapsed ? "Sign out" : undefined}
                        className={cn(
                            "rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                            isCollapsed && "w-9",
                        )}
                    >
                        {isCollapsed ? <SignOutIcon className="mx-auto h-4 w-4" /> : "Sign out"}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar — respects the store's collapsed state */}
            <aside
                className={cn(
                    "hidden shrink-0 flex-col border-r border-border bg-muted/20 transition-[width] duration-200 lg:flex",
                    collapsed ? "w-16" : "w-64",
                )}
            >
                {renderSidebar(collapsed)}
            </aside>

            {/* Mobile drawer — always expanded */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background lg:hidden"
                        >
                            {renderSidebar(false)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <SignOutDialog open={signOutOpen} onClose={() => setSignOutOpen(false)} />
        </>
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
function WalletIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
            <path d="M3 10h18" />
            <circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" />
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
function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.2.48.68.83 1.2.9H21a2 2 0 1 1 0 4h-.09c-.52.07-1 .42-1.2.9Z" />
        </svg>
    );
}
function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}
function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
function SignOutIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

function BellIcon ({ className }: { className?: string}) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}