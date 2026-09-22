import { RequireAuth } from "@/components/RequireAuth";
// import { AdminSidebar } from "@/components/Admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth role="ADMIN">
            <div className="flex min-h-screen">
                {/*<AdminSidebar />*/}
                <main className="flex-1">{children}</main>
            </div>
        </RequireAuth>
    );
}