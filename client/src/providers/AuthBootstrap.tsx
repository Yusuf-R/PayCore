"use client";

import React, { useEffect, useRef } from "react";
import { privateApi } from "@/lib/api/private";
import { useAuthStore } from "@/lib/auth/store/authStore";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const store = useAuthStore.getState();
        store.setStatus("bootstrapping");

        (async () => {
            try {
                const refreshRes = await privateApi.post("/auth/refresh");
                const token = refreshRes.data.data.accessToken;

                // set token first so /auth/me carries the Bearer header
                useAuthStore.getState().setToken(token);

                const meRes = await privateApi.get("/auth/me");
                useAuthStore.getState().setSession(token, meRes.data.data);
            } catch {
                useAuthStore.getState().clearSession();
            }
        })();
    }, []);

    return <>{children}</>;
}