import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SidebarMode = "expanded" | "collapsed";

interface UIState {
    sidebarMode: SidebarMode;
    mobileNavOpen: boolean;
    setSidebarMode: (m: SidebarMode) => void;
    toggleSidebar: () => void;
    setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            sidebarMode: "expanded",
            mobileNavOpen: false,
            setSidebarMode: (sidebarMode) => set({ sidebarMode }),
            toggleSidebar: () =>
                set({ sidebarMode: get().sidebarMode === "expanded" ? "collapsed" : "expanded" }),
            setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
        }),
        {
            name: "paycore.ui",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ sidebarMode: state.sidebarMode }),
        },
    ),
);