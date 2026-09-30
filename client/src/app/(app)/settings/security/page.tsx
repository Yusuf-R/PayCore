"use client";

import React, {useState} from "react";
import {motion} from "motion/react";
import {toast} from "sonner";
import {ShieldCheck, Lock, KeyRound, Smartphone, AlertTriangle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useSetPin, useChangePin} from "@/hooks/auth/useAuth";
import {useAuthStore} from "@/lib/auth/store/authStore";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SecuritySettingsPage() {
    const user = useAuthStore((s) => s.user);
    const hasPin = !!user?.pinSetAt;

    return (
        <div className="space-y-8">
            <PinSection hasPin={hasPin} pinSetAt={user?.pinSetAt ?? null}/>
            <PasswordSection/>
            <SessionsSection/>
        </div>
    );
}

/* -------------------- PIN -------------------- */

function PinSection({hasPin, pinSetAt}: { hasPin: boolean; pinSetAt: string | null }) {
    const setPin = useSetPin();
    const changePin = useChangePin();
    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    function validate(): boolean {
        if (!/^\d{4}$/.test(newPin)) return toast.error("PIN must be 4 digits"), false;
        if (newPin !== confirmPin) return toast.error("PINs do not match"), false;
        if (/^(\d)\1{3}$/.test(newPin) || newPin === "1234" || newPin === "4321") {
            return toast.error("Choose a stronger PIN"), false;
        }
        return true;
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const onSuccess = () => {
            toast.success(hasPin ? "PIN changed" : "PIN set");
            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");
        };
        const onError = (err: unknown) =>
            toast.error(err instanceof Error ? err.message : "Something went wrong");

        if (hasPin) {
            changePin.mutate({currentPin, newPin}, {onSuccess, onError});
        } else {
            setPin.mutate(newPin, {onSuccess, onError});
        }
    }

    const pending = setPin.isPending || changePin.isPending;

    return (
        <Section
            title="Transaction PIN"
            description="Required to authorise any money movement."
            icon={<KeyRound className="h-4 w-4"/>}
        >
            {hasPin ? (
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary"/>
                    <span>
            PIN set{" "}
                        {pinSetAt && `on ${new Date(pinSetAt).toLocaleDateString()}`}
          </span>
                </div>
            ) : (
                <div
                    className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-destructive"/>
                    <span>You need to set a PIN before sending money.</span>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                {hasPin && (
                    <div className="space-y-2">
                        <Label htmlFor="current">Current PIN</Label>
                        <PinInput id="current" value={currentPin} onChange={setCurrentPin}/>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="new">{hasPin ? "New PIN" : "PIN"}</Label>
                    <PinInput id="new" value={newPin} onChange={setNewPin}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm {hasPin ? "new " : ""}PIN</Label>
                    <PinInput id="confirm" value={confirmPin} onChange={setConfirmPin}/>
                </div>
                <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                    {pending ? "Saving…" : hasPin ? "Change PIN" : "Set PIN"}
                </Button>
            </form>
        </Section>
    );
}

function PinInput({id, value, onChange,}: { id: string; value: string; onChange: (v: string) => void; }) {
    return (
        <Input
            id={id}
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="••••"
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
            className="max-w-[160px] text-center font-mono text-xl tracking-[0.5em]"
        />
    );
}

/* -------------------- Password -------------------- */

function PasswordSection() {
    return (
        <Section
            title="Password"
            description="Used to log in to your account."
            icon={<Lock className="h-4 w-4"/>}
        >
            <Button variant="outline" disabled>
                Change password — coming soon
            </Button>
        </Section>
    );
}

/* -------------------- Sessions -------------------- */

function SessionsSection() {
    return (
        <Section
            title="Active sessions"
            description="Devices currently signed in to your account."
            icon={<Smartphone className="h-4 w-4"/>}
        >
            <p className="text-sm text-muted-foreground">
                Session management — coming soon.
            </p>
        </Section>
    );
}

/* -------------------- Shell -------------------- */

function Section({
                     title,
                     description,
                     icon,
                     children,
                 }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <motion.section
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, ease: EASE}}
            className="rounded-2xl border border-border bg-background"
        >
            <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
            {icon}
          </span>
                    <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="p-6">{children}</div>
        </motion.section>
    );
}