// src/lib/sidebar-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SidebarMode = "full" | "icon-text" | "icon-only";

interface SidebarState {
    mode: SidebarMode;
    setMode: (mode: SidebarMode) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            mode: "icon-text",
            setMode: (mode) => set({ mode }),
        }),
        { name: "paycore-sidebar-mode" } // localStorage — pure UI pref, correctly placed
    )
);