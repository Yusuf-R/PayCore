import { privateApi } from "@/lib/api/private";

export interface Wallet {
    id: string;
    currency: string;
    balanceFlat: string;
}

class WalletService {
    async getMyWallet(): Promise<Wallet> {
        const res = await privateApi.get<{ data: Wallet }>("/wallets/me");
        return res.data.data;
    }

    async fundWallet(amountFlat: string): Promise<Wallet> {
        const res = await privateApi.post<{ data: Wallet }>("/wallets/fund", {
            amountFlat,
        });
        return res.data.data;
    }
}

export const walletService = new WalletService();