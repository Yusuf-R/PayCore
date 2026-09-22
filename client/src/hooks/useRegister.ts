"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type RegisterPayload } from "@/services/auth/AuthService";

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: RegisterPayload) => authService.register(payload),
        onSuccess: (_data, variables) => {
            router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
        },
    });
}