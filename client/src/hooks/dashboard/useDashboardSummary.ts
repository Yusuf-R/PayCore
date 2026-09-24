// src/hooks/useDashboardSummary.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard/DashboardService";

export function useDashboardSummary() {
    return useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: () => dashboardService.getSummary(),
        staleTime: 30_000,
    });
}

export function useAdminDashboardSummary() {
    return useQuery({
        queryKey: ["admin", "dashboard", "summary"],
        queryFn: () => dashboardService.getAdminSummary(),
        staleTime: 30_000,
    });
}