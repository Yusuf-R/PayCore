"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type LoginPayload } from "@/services/auth/AuthService";
import { useAuthStore } from "@/lib/auth/store/authStore";

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: ({ accessToken, user }) => {
            useAuthStore.getState().setSession(accessToken, user);
            router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
        },
    });
}