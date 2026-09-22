import Link from "next/link";
import { ReceiptCard } from "@/components/Marketing/ReceiptCard";
import { LiveFeed } from "@/components/Marketing/LiveFeed";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative grid min-h-screen lg:grid-cols-[1fr_1fr]">
            {/* ---------- Left: form ---------- */}
            <div className="relative flex flex-col px-6 py-10 lg:px-12 lg:py-12">
                <Link href="/" className="group flex w-fit items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition-transform group-hover:scale-105">
            P
          </span>
                    <span className="text-lg font-bold tracking-tight">PayCore</span>
                </Link>

                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-sm">{children}</div>
                </div>

                <p className="text-center font-mono text-xs text-muted-foreground lg:text-left">
                    Every operation logged · Every transfer atomic
                </p>
            </div>

            {/* ---------- Right: ambient visual ---------- */}
            <div className="relative flex h-full flex-col items-center justify-center gap-10 p-12">
                <div className="w-full max-w-sm">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        A wallet you can audit
                    </p>
                    <p className="mt-4 text-2xl font-extrabold leading-snug tracking-tight">
                        Every transfer <span className="text-primary">atomic</span>.
                        Every action <span className="text-primary">recorded</span>.
                    </p>
                    <div className="mt-10">
                        <ReceiptCard />
                    </div>
                </div>

                <div className="w-full max-w-sm">
                    <LiveFeed />
                </div>
            </div>
        </div>
    );
}