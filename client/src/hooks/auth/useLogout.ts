"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/AuthService";
import { useAuthStore } from "@/lib/auth/store/authStore";

export function useLogout() {
    const router = useRouter();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSettled: () => {
            useAuthStore.getState().clearSession();
            router.push("/login");
        },
    });
}