"use client";

import { useMutation } from "@tanstack/react-query";
import { userService, type UpdateProfileInput } from "@/services/user/UserService";
import { useAuthStore } from "@/lib/auth/store/authStore";

export function useUpdateProfile() {
    return useMutation({
        mutationFn: (input: UpdateProfileInput) => userService.updateProfile(input),
        onSuccess: (user) => {
            const current = useAuthStore.getState();
            if (current.accessToken) {
                current.setSession(current.accessToken, user);
            }
        },
    });
}