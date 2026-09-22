"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const commitments = [
    {
        n: "01",
        title: "Every transfer is atomic",
        body: "Debiting one wallet and crediting another happens as a single database operation. If any part fails, the whole transfer rolls back — balances never drift out of sync.",
    },
    {
        n: "02",
        title: "Retries don't duplicate a payment",
        body: "Every transfer carries a unique key. Sending the same request twice — a network retry, a double click — returns the original result instead of moving money a second time.",
    },
    {
        n: "03",
        title: "Every action leaves a record",
        body: "Logins, transfers, and account changes write to a permanent audit log. Not for show — because a system that can't explain what happened to your money isn't worth trusting.",
    },
];

const notDoing = [
    "Store money as floating-point numbers",
    "Trust the client to send what it claims",
    "Leave a transfer in a half-finished state",
    "Skip the audit log for a quick fix",
    "Add a feature because it looks clever",
];

export function About() {
    return (
        <div>
            {/* ---------- Hero ---------- */}
            <section className="relative overflow-hidden px-6 pt-24 pb-20 lg:px-8 lg:pt-32 lg:pb-28">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
                <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[600px] bg-glow opacity-70" />

                <div className="mx-auto max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                        About
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
                        className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        Built to move money{" "}
                        <span className="relative inline-block">
              <span className="relative z-10 text-primary">correctly</span>
              <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
                  className="absolute bottom-1 left-0 -z-0 h-2.5 w-full origin-left bg-primary/20"
              />
            </span>
                        , not just quickly.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
                        className="mt-8 text-lg leading-relaxed text-muted-foreground"
                    >
                        PayCore is a wallet and transfer system built around one rule:
                        a transfer either completes fully or doesn't happen at all.
                        There is no state — no window, no edge case — where money leaves
                        one wallet without arriving in another.
                    </motion.p>
                </div>
            </section>

            {/* ---------- The rule ---------- */}
            <section className="border-y border-border bg-muted/30 px-6 py-24 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-primary"
                    >
                        Rule / 01
                    </motion.p>

                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
                        className="mt-6 border-l-2 border-primary pl-6 sm:pl-8"
                    >
                        <p className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-4xl">
                            A transfer either completes fully,{" "}
                            <span className="text-muted-foreground">or it doesn't happen at all.</span>
                        </p>
                    </motion.blockquote>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                        className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground"
                    >
                        It's a small sentence with enormous implications. It rules out
                        partial writes, eventual consistency as a default, and every
                        shortcut that trades correctness for throughput. It's why the
                        whole system is built the way it is.
                    </motion.p>
                </div>
            </section>

            {/* ---------- Commitments ---------- */}
            <section className="px-6 py-24 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                        Three commitments
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.65, delay: 0.05, ease: EASE }}
                        className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl"
                    >
                        What that rule produces.
                    </motion.h2>

                    <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
                        {commitments.map((item, i) => (
                            <motion.div
                                key={item.n}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                                className="group relative bg-background p-8 transition-colors hover:bg-muted/40"
                            >
                <span className="font-mono text-xs tracking-widest text-primary">
                  {item.n}
                </span>
                                <h3 className="mt-6 text-xl font-bold tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                    {item.body}
                                </p>

                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: EASE }}
                                    className="absolute inset-x-8 bottom-0 h-px origin-left bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- What we don't do ---------- */}
            <section className="border-t border-border px-6 py-24 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                        What we don't do
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.65, delay: 0.05, ease: EASE }}
                        className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
                    >
                        Restraint is a feature.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
                        className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
                    >
                        Every system is defined as much by what it refuses to do as by
                        what it does. These are the shortcuts PayCore will not take.
                    </motion.p>

                    <ul className="mt-12 space-y-px">
                        {notDoing.map((item, i) => (
                            <motion.li
                                key={item}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                                className="group flex items-center gap-4 border-b border-border py-5 last:border-b-0"
                            >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground transition-colors group-hover:border-destructive/50 group-hover:text-destructive">
                  ✕
                </span>
                                <span className="text-base text-muted-foreground transition-colors group-hover:text-foreground">
                  {item}
                </span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ---------- Close ---------- */}
            <section className="border-t border-border bg-muted/30 px-6 py-24 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl"
                    >
                        A financial system that can't explain what happened to your money
                        <span className="text-muted-foreground"> isn't one worth trusting.</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                        className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
                    >
                        PayCore exists to demonstrate that a small, well-considered system
                        can be more trustworthy than a large, loosely-considered one. Every
                        decision here is made in that spirit.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                        — Built in Lagos
                    </motion.div>
                </div>
            </section>
        </div>
    );
}