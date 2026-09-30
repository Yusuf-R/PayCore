import { privateApi } from "@/lib/api/private";

export interface AccountLookup {
    accountNumber: string;
    accountName: string;
    currency: string;
}

export interface Transfer {
    id: string;
    type: "TRANSFER" | "FUNDING" | "WITHDRAWAL";
    status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
    direction: "IN" | "OUT";
    amountFlat: string;
    currency: string;
    description: string | null;
    fromAccountNumber: string | null;
    toAccountNumber: string | null;
    createdAt: string;
    completedAt: string | null;
}

export interface TransferPage {
    items: Transfer[];
    page: number;
    limit: number;
    total: number;
}

export interface SendTransferInput {
    recipientAccountNumber: string;
    amountFlat: string;
    pin: string;
    description?: string;
}

export interface SendTransferResult {
    id: string;
    status: string;
    amountFlat: string;
    currency: string;
    recipientAccountNumber: string;
    newBalanceFlat: string;
    completedAt: string | null;
}

class TransferService {
    async lookupAccount(accountNumber: string): Promise<AccountLookup> {
        const res = await privateApi.get<{ data: AccountLookup }>(
            `/wallets/lookup/${accountNumber}`,
        );
        return res.data.data;
    }

    async send(
        input: SendTransferInput,
        idempotencyKey: string,
    ): Promise<SendTransferResult> {
        const res = await privateApi.post<{ data: SendTransferResult }>(
            "/transfers",
            input,
            { headers: { "Idempotency-Key": idempotencyKey } },
        );
        return res.data.data;
    }

    async list(params: { page?: number; limit?: number } = {}): Promise<TransferPage> {
        const res = await privateApi.get<{ data: TransferPage }>("/transfers", {
            params,
        });
        return res.data.data;
    }

    async getOne(id: string): Promise<Transfer> {
        const res = await privateApi.get<{ data: Transfer }>(`/transfers/${id}`);
        return res.data.data;
    }
}

export const transferService = new TransferService();