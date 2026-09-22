"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
    {
        n: "1",
        title: "You send an amount",
        body: "Enter who you're paying and how much. Nothing leaves your wallet yet — the request is validated first.",
    },
    {
        n: "2",
        title: "The transfer is verified and locked",
        body: "Your balance, their wallet, and the amount are checked together. Either the whole transfer happens, or none of it does.",
    },
    {
        n: "3",
        title: "Both balances update, together",
        body: "The debit and the credit are written in a single atomic step. A permanent record of the transfer is kept.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="relative overflow-hidden px-6 py-28 lg:px-8">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" />

            <div className="mx-auto max-w-3xl">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                    How it works
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.65, delay: 0.05, ease: EASE }}
                    className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
                >
                    A transfer, end to end.
                </motion.h2>

                <div className="relative mt-16">
                    {/* vertical spine */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 1.2, ease: EASE }}
                        className="absolute left-[15px] top-2 bottom-2 w-px origin-top bg-border"
                    />

                    <ol className="space-y-14">
                        {steps.map((step, i) => (
                            <motion.li
                                key={step.n}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
                                className="relative flex gap-6"
                            >
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-bold text-primary shadow-sm">
                  {step.n}
                </span>
                                <div className="pt-1">
                                    <h3 className="text-lg font-bold tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {step.body}
                                    </p>
                                </div>
                            </motion.li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}