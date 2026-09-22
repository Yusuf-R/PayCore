// src/components/auth/OTPInput.tsx
"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export function OTPInput({
                             value,
                             onChange,
                             length = 6,
                             error,
                         }: {
    value: string;
    onChange: (v: string) => void;
    length?: number;
    error?: boolean;
}) {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    function setDigit(index: number, digit: string) {
        const chars = value.padEnd(length, " ").split("");
        chars[index] = digit;
        const next = chars.join("").replace(/\s+$/, "").slice(0, length);
        onChange(next);
        if (digit && index < length - 1) inputsRef.current[index + 1]?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        onChange(pasted);
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    }

    return (
        <div className="flex gap-2" onPaste={handlePaste}>
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    value={value[i] ?? ""}
                    onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, "").slice(-1))}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    inputMode="numeric"
                    maxLength={1}
                    className={cn(
                        "h-12 w-11 rounded-md border bg-background text-center font-mono-num text-lg text-foreground outline-none transition-colors",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        error ? "border-destructive" : "border-input"
                    )}
                />
            ))}
        </div>
    );
}