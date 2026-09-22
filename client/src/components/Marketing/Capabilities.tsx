"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const items = [
    {
        n: "01",
        title: "Instant transfers",
        body: "Send money to any PayCore wallet. Debits and credits land in a single database transaction — no partial writes, no lost value.",
    },
    {
        n: "02",
        title: "Complete history",
        body: "Every transfer is recorded with a status, a timestamp, and an immutable audit trail. Nothing is ever silently dropped.",
    },
    {
        n: "03",
        title: "Two-factor protection",
        body: "Log in with your password. Authorise transfers with a separate transaction PIN. Compromise one, the other still holds.",
    },
    {
        n: "04",
        title: "Idempotent by design",
        body: "Retries never double-charge. Every request carries a key the server records, so a network hiccup can't move money twice.",
    },
];

export function Capabilities() {
    return (
        <section className="border-b border-border px-6 py-24 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                    What it does
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.65, delay: 0.05, ease: EASE }}
                    className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl"
                >
                    Built on the boring parts done right.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
                    className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
                >
                    Money is not a place for cleverness. PayCore is deliberately conservative —
                    every operation that touches a balance is atomic, logged, and reversible
                    only through an explicit, audited path.
                </motion.p>

                <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                            className="group relative bg-background p-7 transition-colors hover:bg-muted/50"
                        >
              <span className="font-mono text-xs tracking-widest text-primary">
                {item.n}
              </span>
                            <h3 className="mt-5 text-lg font-bold tracking-tight">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {item.body}
                            </p>

                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: EASE }}
                                className="absolute inset-x-7 bottom-0 h-px origin-left bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}