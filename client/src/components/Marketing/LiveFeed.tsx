// src/components/Marketing/LiveFeed.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const TRANSACTIONS = [
    { wallet: "•• 7742", amount: "₦12,400.00", time: "2s ago" },
    { wallet: "•• 0093", amount: "₦25,000.00", time: "6s ago" },
    { wallet: "•• 3315", amount: "₦8,150.00", time: "11s ago" },
    { wallet: "•• 5588", amount: "₦40,000.00", time: "18s ago" },
    { wallet: "•• 2207", amount: "₦3,200.00", time: "24s ago" },
];

export function LiveFeed() {
    const [items, setItems] = useState(TRANSACTIONS.slice(0, 3));
    const [pool, setPool] = useState(TRANSACTIONS.slice(3));

    useEffect(() => {
        const interval = setInterval(() => {
            setItems((prev) => {
                const next = pool[0] ?? TRANSACTIONS[Math.floor(Math.random() * TRANSACTIONS.length)];
                setPool((p) => (p.length > 1 ? p.slice(1) : TRANSACTIONS));
                return [next, ...prev.slice(0, 2)];
            });
        }, 2800);
        return () => clearInterval(interval);
    }, [pool]);

    return (
        <div className="space-y-2" aria-hidden="true">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                />
                Live transfers
            </p>

            <ul className="space-y-1.5">
                <AnimatePresence initial={false}>
                    {items.map((tx, i) => (
                        <motion.li
                            key={`${tx.wallet}-${tx.time}-${i}`}
                            layout
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1 - i * 0.25, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center justify-between border-b border-(--line)/60 pb-1.5 text-xs"
                        >
                            <span className="font-mono-num text-muted-foreground">Wallet {tx.wallet}</span>
                            <span className="font-mono-num text-foreground">{tx.amount}</span>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
}