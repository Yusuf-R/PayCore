"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type VerifyEmailPayload } from "@/services/auth/AuthService";

export function useVerifyEmail() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: VerifyEmailPayload) => authService.verifyEmail(payload),
        onSuccess: () => {
            router.push("/login?verified=success");
        },
    });
}