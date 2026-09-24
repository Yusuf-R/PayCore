"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/AuthService";
import type { ResetPasswordFormValues } from "@/schemas/AuthSchema";

export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: ResetPasswordFormValues) => authService.resetPassword(payload),
        onSuccess: () => {
            router.push("/login?reset=success");
        },
    });
}