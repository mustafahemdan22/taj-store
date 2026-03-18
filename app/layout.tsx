import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Taj Scarf",
  description: "Luxury scarves",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <AppProviders>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

