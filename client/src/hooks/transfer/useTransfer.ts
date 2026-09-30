"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transferService } from "@/services/transfer/TransferService";
import type { SendTransferInput } from "@/services/transfer/TransferService";

export function useTransferHistory(page = 1, limit = 20) {
    return useQuery({
        queryKey: ["transfers", "list", page, limit],
        queryFn: () => transferService.list({ page, limit }),
        staleTime: 15_000,
    });
}

export function useTransferDetail(id: string | undefined) {
    return useQuery({
        queryKey: ["transfers", "detail", id],
        queryFn: () => transferService.getOne(id!),
        enabled: !!id,
        staleTime: 60_000,
    });
}

export function useAccountLookup() {
    return useMutation({
        mutationFn: (accountNumber: string) => transferService.lookupAccount(accountNumber),
    });
}

export function useSendTransfer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         input,
                         idempotencyKey,
                     }: {
            input: SendTransferInput;
            idempotencyKey: string;
        }) => transferService.send(input, idempotencyKey),
        onSuccess: async (result) => {
            // Update wallet cache with the new balance — no refetch needed
            queryClient.setQueryData(
                ["wallet", "me"],
                (old: { id: string; accountNumber: string; currency: string; balanceFlat: string } | undefined) =>
                    old ? { ...old, balanceFlat: result.newBalanceFlat } : old,
            );
            // Invalidate history so the new transfer appears
           await queryClient.invalidateQueries({ queryKey: ["transfers", "list"] });
        },
    });
}