import { RequireAuth } from "@/components/RequireAuth";
import { UserSidebar } from "@/components/Dashboard/UserSideNav";
import { Topbar } from "@/components/Dashboard/Topbar";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth>
            <div className="flex h-screen overflow-hidden">
                <UserSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </RequireAuth>
    );
}