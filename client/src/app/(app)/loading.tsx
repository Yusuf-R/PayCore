export default function AppLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Preparing your dashboard…
                </p>
            </div>
        </div>
    );
}