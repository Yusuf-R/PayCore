import { RequireAuth } from "@/components/RequireAuth";
// import { UserSidebar } from "@/components/Dashboard/UserSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth>
            <div className="flex min-h-screen">
                {/*<UserSidebar />*/}
                <main className="flex-1">{children}</main>
            </div>
        </RequireAuth>
    );
}