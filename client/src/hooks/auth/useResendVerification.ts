"use client";

import { useMutation } from "@tanstack/react-query";
import { authService, type ResendVerificationPayload } from "@/services/auth/AuthService";

export function useResendVerification() {
    return useMutation({
        mutationFn: (payload: ResendVerificationPayload) =>
            authService.resendVerification(payload),
    });
}