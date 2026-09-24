"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Plus, Download } from "lucide-react";
import { FundWalletModal } from "./FundeWalletModal";
import { cn } from "@/lib/utils";

const ACTIONS = [
    { key: "send", label: "Send", icon: ArrowUpRight, disabled: true },
    { key: "fund", label: "Fund", icon: Plus, disabled: false },
    { key: "withdraw", label: "Withdraw", icon: Download, disabled: true },
] as const;

export function QuickActions() {
    const [fundOpen, setFundOpen] = useState(false);

    return (
        <>
            <div className="grid grid-cols-3 gap-3">
                {ACTIONS.map((action) => {
                    const Icon = action.icon;
                    const handleClick = () => {
                        if (action.key === "fund") setFundOpen(true);
                    };

                    return (
                        <motion.button
                            key={action.key}
                            type="button"
                            onClick={handleClick}
                            disabled={action.disabled}
                            whileHover={action.disabled ? undefined : { y: -2 }}
                            whileTap={action.disabled ? undefined : { y: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className={cn(
                                "group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-sm font-medium transition-colors",
                                action.disabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:border-primary/40 hover:bg-primary/5",
                            )}
                        >
              <span
                  className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                      action.disabled
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                  )}
              >
                <Icon className="h-4 w-4" />
              </span>
                            <span>{action.label}</span>
                        </motion.button>
                    );
                })}
            </div>

            <FundWalletModal open={fundOpen} onClose={() => setFundOpen(false)} />
        </>
    );
}