"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet/WalletService";

export function useWallet() {
    return useQuery({
        queryKey: ["wallet", "me"],
        queryFn: () => walletService.getMyWallet(),
        staleTime: 30_000,
    });
}

export function useFundWallet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amountFlat: string) => walletService.fundWallet(amountFlat),
        onSuccess: (wallet) => {
            // Update the cache directly — no refetch needed
            queryClient.setQueryData(["wallet", "me"], wallet);
        },
    });
}