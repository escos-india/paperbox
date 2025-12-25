import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StoreProvider } from "@/lib/store-context";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PAPERBOX | IT Management & Infrastructure Services",
  description: "Enterprise-grade IT infrastructure, managed services, and support for modern businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <AuthProvider>
          <StoreProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position="top-center" />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
