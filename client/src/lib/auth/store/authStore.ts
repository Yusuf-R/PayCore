import { create } from "zustand";

export interface AuthUser {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    status: string;
    kycStatus: string;
    emailVerifiedAt: string | null;
}

export type AuthStatus = "idle" | "bootstrapping" | "ready" | "unauthenticated";

interface AuthState {
    accessToken: string | null;
    user: AuthUser | null;
    status: AuthStatus;

    setToken: (token: string | null) => void;
    setSession: (token: string, user: AuthUser) => void;
    clearSession: () => void;
    setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    status: "idle",

    setToken: (token) => set({ accessToken: token }),
    setSession: (token, user) => set({ accessToken: token, user, status: "ready" }),
    clearSession: () => set({ accessToken: null, user: null, status: "unauthenticated" }),
    setStatus: (status) => set({ status }),
}));