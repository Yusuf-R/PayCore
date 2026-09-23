import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface VerifyFlowState {
    email: string | null;
    setEmail: (email: string) => void;
    clear: () => void;
}

export const useVerifyFlowStore = create<VerifyFlowState>()(
    persist(
        (set) => ({
            email: null,
            setEmail: (email) => set({ email }),
            clear: () => set({ email: null }),
        }),
        {
            name: "paycore.verify-flow",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);