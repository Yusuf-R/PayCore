"use client";

import {useMutation} from "@tanstack/react-query";
import {authService, type VerifyEmailPayload} from "@/services/auth/AuthService";
import {useVerifyFlowStore} from "@/lib/auth/store/verifyFlowStore";
import {useAuthStore} from "@/lib/auth/store/authStore";
import {toast} from "sonner";

export function useVerifyEmail() {
    return useMutation({
        mutationFn: (payload: VerifyEmailPayload) => authService.verifyEmail(payload),
        onSuccess: ({accessToken, user}) => {
            useVerifyFlowStore.getState().clear();
            useAuthStore.getState().setSession(accessToken, user);
            toast.success("Email verified", {description: "Welcome to PayCore."});
        },
    });
}