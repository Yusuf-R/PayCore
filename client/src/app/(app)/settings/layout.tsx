"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { PageHeader } from "@/components/Dashboard/PageHeader";
import { cn } from "@/lib/utils";

const TABS = [
    { href: "/settings/profile", label: "Profile" },
    { href: "/settings/security", label: "Security" },
    { href: "/settings/notifications", label: "Notifications" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="mx-auto max-w-3xl p-6 lg:p-8">
            <PageHeader title="Settings" description="Manage your account." />

            <div className="mt-8 flex gap-1 border-b border-border">
                {TABS.map((tab) => {
                    const active = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-colors",
                                active
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {tab.label}
                            {active && (
                                <motion.span
                                    layoutId="settings-tab"
                                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8">{children}</div>
        </div>
    );
}