"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth/store/authStore";
import { useUpdateProfile } from "@/hooks/user/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {normalizeNigerianPhone } from "@/lib/validators/phone";

const profileSchema = z.object({
    firstName: z.string().trim().max(50).optional().or(z.literal("")),
    lastName: z.string().trim().max(50).optional().or(z.literal("")),
    phone: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || normalizeNigerianPhone(v) !== null,
            "Enter a valid Nigerian phone number",
        ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
    const user = useAuthStore((s) => s.user);
    const update = useUpdateProfile();

    const { control, handleSubmit, reset, formState } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phone: user?.phone ?? "",
        },
    });

    // If the user object changes (e.g. after another update elsewhere), keep form in sync
    useEffect(() => {
        reset({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phone: user?.phone ?? "",
        });
    }, [user?.id, reset]);

    function onSubmit(values: ProfileFormValues) {
        const payload = {
            ...(values.firstName ? { firstName: values.firstName } : {}),
            ...(values.lastName ? { lastName: values.lastName } : {}),
            ...(values.phone ? { phone: values.phone } : {}),
        };

        update.mutate(payload, {
            onSuccess: () => {
                toast.success("Profile updated");
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : "Could not update profile");
            },
        });
    }

    const isDirty = formState.isDirty;

    return (
        <div className="rounded-2xl border border-border bg-background">
            <div className="border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold tracking-tight">Profile</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                    Your name and phone appear on receipts and to people you transact with.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email ?? ""} disabled />
                    <p className="text-xs text-muted-foreground">
                        Email changes require re-verification — coming soon.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" {...field} />
                                {fieldState.error && (
                                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" {...field} />
                                {fieldState.error && (
                                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>

                <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+234 706 851 8999"
                                {...field}
                                onBlur={(e) => {
                                    field.onBlur(); // let RHF mark it as touched
                                    const normalized = normalizeNigerianPhone(e.target.value);
                                    if (normalized !== null) field.onChange(normalized);
                                }}
                            />
                            {fieldState.error && (
                                <p className="text-xs text-destructive">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={update.isPending || !isDirty}
                        className="min-w-[140px]"
                    >
                        {update.isPending ? "Saving…" : "Save changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}