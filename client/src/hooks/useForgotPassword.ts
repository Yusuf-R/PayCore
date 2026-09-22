"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/AuthService";
import type { ForgotPasswordFormValues } from "@/schemas/AuthSchema";

export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordFormValues) => authService.forgotPassword(payload),
    });
}