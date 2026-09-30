"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth/store/authStore";

export default function ProfileSettingsPage() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-sm font-semibold tracking-tight">Profile</h2>
            <p className="mt-1 text-xs text-muted-foreground">
                This information appears on receipts and to people you transact with.
            </p>

            <div className="mt-6 space-y-4">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email ?? ""} disabled />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue={user?.firstName ?? ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue={user?.lastName ?? ""} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={user?.phone ?? ""} />
                </div>
                <Button disabled>Save changes — endpoint coming soon</Button>
            </div>
        </div>
    );
}