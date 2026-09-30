"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/AuthService";
import { useAuthStore } from "@/lib/auth/store/authStore";

export function useSetPin() {
    return useMutation({
        mutationFn: (pin: string) => authService.setPin(pin),
        onSuccess: ({ pinSetAt }) => {
            const user = useAuthStore.getState().user;
            if (user) useAuthStore.getState().setSession(useAuthStore.getState().accessToken!, {
                ...user,
                pinSetAt,
            });
        },
    });
}

export function useChangePin() {
    return useMutation({
        mutationFn: ({ currentPin, newPin }: { currentPin: string; newPin: string }) =>
            authService.changePin(currentPin, newPin),
    });
}