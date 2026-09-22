"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
                scrolled
                    ? "border-border/80 bg-background/80 backdrop-blur-xl"
                    : "border-transparent bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
                <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition-transform group-hover:scale-105">
            P
          </span>
                    <span className="text-lg font-bold tracking-tight">PayCore</span>
                </Link>

                <nav className="hidden items-center gap-1 text-sm sm:flex">
                    <Link
                        href="/about"
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        About
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        Log in
                    </Link>
                    <ThemeToggle />
                    <Button asChild size="sm" className="ml-3 shadow-md shadow-primary/20">
                        <Link href="/register">Open an account</Link>
                    </Button>
                </nav>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border sm:hidden"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                        {open ? (
                            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        ) : (
                            <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        )}
                    </svg>
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-border bg-background sm:hidden"
                    >
                        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4 text-sm">
                            <Link href="/about" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                                About
                            </Link>
                            <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                                Log in
                            </Link>
                            <div className="mt-2 flex items-center justify-between px-3">
                                <span className="text-sm text-muted-foreground">Theme</span>
                                <ThemeToggle />
                            </div>
                            <Button asChild size="sm" className="mt-2">
                                <Link href="/register" onClick={() => setOpen(false)}>Open an account</Link>
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}