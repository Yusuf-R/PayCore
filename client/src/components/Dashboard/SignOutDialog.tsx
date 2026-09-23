"use client";

import {AnimatePresence, motion} from "motion/react";
import {useLogout} from "@/hooks/useLogout";
import {Button} from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SignOutDialog({open, onClose,}: { open: boolean; onClose: () => void; }) {
    const logout = useLogout();

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{opacity: 0, scale: 0.96, y: 8}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.96, y: 8}}
                        transition={{duration: 0.25, ease: EASE}}
                        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold tracking-tight">Sign out of PayCore?</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            You&#39;ll need to enter your password again to log back in.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose} disabled={logout.isPending}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => logout.mutate()}
                                disabled={logout.isPending}
                                className="bg-destructive text-white hover:bg-destructive/90"
                            >
                                {logout.isPending ? "Signing out…" : "Sign out"}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}