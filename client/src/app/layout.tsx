import type {Metadata} from "next";
import {Plus_Jakarta_Sans, IBM_Plex_Mono, Poppins} from "next/font/google";
import {QueryProvider} from "@/providers/QueryProvider";
import {Toaster} from "sonner";
import "./globals.css";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {AuthBootstrap} from "@/providers/AuthBootstrap";

const sans = Poppins({subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700", "800"]});

// const sans = Plus_Jakarta_Sans({
//     subsets: ["latin"],
//     variable: "--font-sans",
//     weight: ["400", "500", "600", "700", "800"],
//     display: "swap",
// });

const mono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500", "600"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "PayCore — Every transfer, accounted for",
    description:
        "A digital wallet and transfer platform built to production standards. Atomic transfers, complete history, no lost cents.",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="font-sans min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
            <QueryProvider>
                <AuthBootstrap>
                    {children}
                    <Toaster position="top-right" duration={5000} richColors/>
                </AuthBootstrap>
            </QueryProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}