'use client';

import { PageHeader } from "@/components/Dashboard/PageHeader";
import { BalanceCard } from "@/components/Dashboard/BalanceCard";
import { QuickActions } from "@/components/Dashboard/QuickActions";
import { RecentTransactions } from "@/components/Dashboard/RecentTransactions";

export default function DashboardPage() {
    return (
        <div className="mx-auto max-w-6xl p-6 lg:p-8">
            <PageHeader
                title="Dashboard"
                description="Your wallet, transfers, and recent activity."
            />
            <div className="mt-8 space-y-6">
                <BalanceCard />
                <QuickActions />
                <RecentTransactions />
            </div>
        </div>
    );
}