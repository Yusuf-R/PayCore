"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ReceiptCard } from "./ReceiptCard";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pt-20 pb-28 lg:px-8 lg:pt-28 lg:pb-36">
            {/* ambient layers */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[700px] bg-glow" />

            <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                        Digital wallet · Atomic transfers
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
                        className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
                    >
                        Every transfer,{" "}
                        <span className="relative inline-block">
              <span className="relative z-10 text-primary">accounted for.</span>
              <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
                  className="absolute bottom-1.5 left-0 -z-0 h-3 w-full origin-left bg-primary/20"
              />
            </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                        className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
                    >
                        PayCore holds your balance, moves money between wallets instantly, and keeps
                        a full record of every transaction — no partial transfers, no lost cents,
                        no surprises.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                        className="mt-10 flex flex-wrap gap-3"
                    >
                        <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                            <Button asChild size="lg" className="group h-12 rounded-full px-7 text-base font-semibold shadow-lg shadow-primary/25">
                                <Link href="/register">
                                    Open an account
                                    <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </Link>
                            </Button>
                        </motion.div>
                        <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7 text-base">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-6 font-mono text-xs text-muted-foreground"
                    >
                        Every operation logged · Every transfer atomic
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40, rotate: 5 }}
                    animate={{ opacity: 1, y: 0, rotate: 1.5 }}
                    transition={{ duration: 1, delay: 0.35, ease: EASE }}
                    className="flex justify-center lg:justify-end"
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ReceiptCard />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}