import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/layout/AppHeader";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const noto_sans_jp = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hacker News JP",
  description: "This is a client for hacker news for Japanese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={cn(noto_sans_jp.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen container mx-auto px-4">
            <div className="h-16">
              <AppHeader />
            </div>
            <div className="flex-1 mb-16">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
