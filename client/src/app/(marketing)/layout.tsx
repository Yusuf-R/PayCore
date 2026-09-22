// src/app/(marketing)/layout.tsx
import { Navbar } from "@/components/Marketing/Navbar";
import { Footer } from "@/components/Marketing/Footer";
import React from "react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-(--paper) text-(--ink)">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}