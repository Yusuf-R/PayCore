import { motion } from "motion/react";
import {cn} from "@/lib/utils";
import {Check} from "lucide-react";

const PASSWORD_RULES = [
    { key: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    { key: "upper", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { key: "lower", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
    { key: "number", label: "One number", test: (v: string) => /[0-9]/.test(v) },
    { key: "symbol", label: "One symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];


export function PasswordStrength({ value, showErrors }: { value: string; showErrors: boolean }) {
    const passedCount = PASSWORD_RULES.filter((r) => r.test(value)).length;
    const strengthLabel = value.length === 0 ? "" : STRENGTH_LABELS[passedCount];

    return (
        <div className="space-y-3 pt-1">
            {/* Segmented strength meter */}
            <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                    {PASSWORD_RULES.map((_, i) => (
                        <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                            <motion.div
                                className={cn(
                                    "h-full rounded-full",
                                    passedCount <= 2 ? "bg-destructive" : passedCount <= 3 ? "bg-amber-500" : "bg-primary"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: i < passedCount ? "100%" : "0%" }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    ))}
                </div>
                {strengthLabel && (
                    <span className="font-mono-num text-[10px] uppercase tracking-wider text-muted-foreground">
            {strengthLabel}
          </span>
                )}
            </div>

            {/* Checklist */}
            <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                {PASSWORD_RULES.map((rule) => {
                    const satisfied = rule.test(value);
                    const flagged = showErrors && !satisfied;
                    return (
                        <li
                            key={rule.key}
                            className={cn(
                                "flex items-center gap-2 text-xs transition-colors",
                                satisfied ? "text-foreground" : flagged ? "text-destructive" : "text-muted-foreground"
                            )}
                        >
              <span
                  className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      satisfied
                          ? "border-primary bg-primary text-primary-foreground"
                          : flagged
                              ? "border-destructive"
                              : "border-border"
                  )}
              >
                {satisfied && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
                            {rule.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}