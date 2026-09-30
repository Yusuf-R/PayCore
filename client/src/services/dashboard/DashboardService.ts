// client/src/services/dashboard/DashboardService.tsx
// client/src/services/dashboard/DashboardService.tsx
import { privateApi } from "@/lib/api/private";

export interface WalletSummary {
    balance: number;
    currency: string;
}

export interface TransactionSummary {
    id: string;
    type: "TRANSFER" | "FUNDING" | "WITHDRAWAL";
    status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
    amount: number;
    currency: string;
    counterparty: string | null; // wallet label or masked id on the other side
    createdAt: string;
}

export interface DashboardSummary {
    wallet: WalletSummary;
    recentTransactions: TransactionSummary[];
    unreadNotifications: number;
    kycStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
}

export interface AdminDashboardSummary {
    totalUsers: number;
    activeUsers: number;
    totalWalletBalance: number;
    currency: string;
    pendingReconciliations: number;
    recentAuditEvents: {
        id: string;
        action: string;
        actorLabel: string;
        createdAt: string;
    }[];
}

class DashboardService {
    async getSummary(): Promise<DashboardSummary> {
        const res = await privateApi.get<{ data: DashboardSummary }>("/dashboard/summary");
        return res.data.data;
    }

    async getAdminSummary(): Promise<AdminDashboardSummary> {
        const res = await privateApi.get<{ data: AdminDashboardSummary }>("/admin/dashboard/summary");
        return res.data.data;
    }
}

export const dashboardService = new DashboardService();