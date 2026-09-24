// src/components/Dashboard/Topbar.tsx
"use client";

import { useTheme } from "next-themes";
import { Bell, Sun, Moon, Menu } from "lucide-react";
import { useUIStore } from "@/lib/store/ui/uiStore";
import { useAuthStore } from "@/lib/auth/store/authStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirm } from "./LogoutConfirm";

export function Topbar({ unreadCount = 0 }: { unreadCount?: number }) {
    const user = useAuthStore((s) => s.user);
    const { theme, setTheme } = useTheme();
    const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

    return (
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
            {/* Left: mobile menu trigger */}
            <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
                    )}
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-md p-1 hover:bg-muted">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatarUrl ?? undefined} />
                                <AvatarFallback className="bg-primary/15 text-xs font-bold uppercase text-primary">
                                    {user?.email?.[0] ?? "?"}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                            <p className="truncate text-sm font-medium">{user?.firstName ?? user?.email?.split("@")[0]}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><a href="/settings">Settings</a></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <LogoutConfirm asMenuItem />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}