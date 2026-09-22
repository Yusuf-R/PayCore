// src/components/marketing/Footer.tsx
import Link from "next/link";

const columns = [
    {
        heading: "Product",
        links: [
            { label: "How it works", href: "/#how-it-works" },
            { label: "About", href: "/about" },
        ],
    },
    {
        heading: "Account",
        links: [
            { label: "Open an account", href: "/register" },
            { label: "Log in", href: "/login" },
        ],
    },
    {
        heading: "Project",
        links: [
            { label: "GitHub", href: "https://github.com/Yusuf-R/paycore" },
            { label: "LinkedIn", href: "https://linkedin.com/in/abdulwasiu-yusuf-10044299" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-(--line) px-6 py-14 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary font-mono-num text-xs font-semibold text-primary-foreground">
                P
              </span>
                            <span className="font-serif text-lg font-semibold text-foreground">PayCore</span>
                        </div>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            A digital wallet and transfer platform built to production standards.
                        </p>
                    </div>

                    {columns.map((col) => (
                        <div key={col.heading}>
                            <h4 className="font-mono-num text-xs uppercase tracking-wider text-muted-foreground">
                                {col.heading}
                            </h4>
                            <ul className="mt-4 space-y-3 text-sm">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-(--line) pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
                    <span>© {new Date().getFullYear()} PayCore</span>
                    <span className="font-mono-num">Built in Lagos</span>
                </div>
            </div>
        </footer>
    );
}