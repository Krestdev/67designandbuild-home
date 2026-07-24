import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/queryProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "67 Design & Build",
  description: "Génie civil et travaux publics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        interTight.variable,
        inter.variable,
      )}
    >
      <QueryProvider>
        <body className="min-h-full flex flex-col font-sans">
           <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </QueryProvider>
    </html>
  );
}
