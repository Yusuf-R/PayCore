"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type RegisterPayload } from "@/services/auth/AuthService";
import {useVerifyFlowStore} from "@/lib/auth/store/verifyFlowStore";

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: RegisterPayload) => authService.register(payload),
        onSuccess: (_data, variables) => {
            useVerifyFlowStore.getState().setEmail(variables.email);
            router.push(`/verify-email`);
        },
    });
}