// src/providers/QueryProvider.tsx
"use client";
import React from "react";
import { getQueryClient } from "./QueryClient";

import { QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}