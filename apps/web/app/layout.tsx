import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IQlify | Practice interviews, earn on Monad",
  description:
    "AI-powered interview practice with onchain MON rewards on Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark font-sans antialiased", inter.variable, orbitron.variable)}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <AppProviders>
          <Navbar />
          <main className="pb-24">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
