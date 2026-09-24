// src/components/Dashboard/LogoutConfirm.tsx
"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/hooks/auth/useLogout";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutConfirm({ asMenuItem }: { asMenuItem?: boolean }) {
    const logout = useLogout();
    const [open, setOpen] = useState(false);

    const trigger = asMenuItem ? (
        <DropdownMenuItem
            onSelect={(e) => {
                e.preventDefault(); // keep the menu from closing before the dialog opens
                setOpen(true);
            }}
            className="text-destructive focus:text-destructive"
        >
            Sign out
        </DropdownMenuItem>
    ) : (
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
        >
            Sign out
        </button>
    );

    return (
        <>
            {trigger}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign out of PayCore?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You&#39;ll need to log in again to access your wallet and transfers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => logout.mutate()}
                            disabled={logout.isPending}
                        >
                            {logout.isPending ? "Signing out…" : "Sign out"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}