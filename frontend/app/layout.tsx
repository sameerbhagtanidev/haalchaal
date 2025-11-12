import "./globals.css";
import ThemeProvider from "@/context/ThemeProvider";
import AuthProvider from "@/context/AuthProvider";

import GlobalToaster from "@/components/layout/GlobalToaster";
import ThemeButton from "@/components/ui/ThemeButton";

import type { ReactNode } from "react";
import type { Metadata } from "next";

import { Roboto, Poetsen_One } from "next/font/google";

const robotoFont = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

const poetsenOneFont = Poetsen_One({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poetsen-one",
});

export const metadata: Metadata = {
    icons: {
        icon: "/favicon.svg",
    },
    title: "HaalChaal | Check-in & Connect with Friends",
    description:
        "Ask your friends about their 'HaalChaal' (well-being)! HaalChaal is your new platform for instant messaging. Easily find users, send friend requests, and start chatting.",
};

type RootLayoutProps = Readonly<{
    children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning className="dark">
            <body
                className={`${robotoFont.className} ${poetsenOneFont.variable}`}
            >
                <main className="flex h-dvh w-full items-center justify-center bg-[url('/pattern.svg')] bg-size-[150px] bg-repeat md:bg-size-[250px]">
                    <ThemeProvider>
                        <ThemeButton />
                        <AuthProvider>{children}</AuthProvider>
                        <GlobalToaster />
                    </ThemeProvider>
                </main>
            </body>
        </html>
    );
}
