"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { ReviewProvider } from "@/contexts/ReviewProvider";
import { WishlistProvider } from "@/contexts/WishlistProvider";
import { OrderProvider } from "@/contexts/OrderProvider";
import { Toaster } from "sonner";
import { store } from "@/store";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  if (typeof window !== "undefined") {
    console.error("NEXT_PUBLIC_CONVEX_URL is not defined. Please check your environment variables.");
  }
}

const convex = new ConvexReactClient(
  convexUrl || "https://missing-url.convex.cloud"
);

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AppProviders({ children }: { children: React.ReactNode }) {
  // If no key is provided (e.g. during Vercel build before env vars are set), 
  // we provide a placeholder to prevent the app from crashing during static generation.
  // Auth functionality will require the real key in the Vercel dashboard.
  if (!publishableKey) {
    return (
      <ConvexProvider client={convex}>
        <Provider store={store}>
          <ThemeProvider>
            <LanguageProvider>
              <WishlistProvider>
                <OrderProvider>
                  <ReviewProvider>
                    {children}
                    <Toaster position="top-center" />
                  </ReviewProvider>
                </OrderProvider>
              </WishlistProvider>
            </LanguageProvider>
          </ThemeProvider>
        </Provider>
      </ConvexProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ConvexProvider client={convex}>
        <Provider store={store}>
          <ThemeProvider>
            <LanguageProvider>
              <WishlistProvider>
                <OrderProvider>
                  <ReviewProvider>
                    {children}
                    <Toaster position="top-center" />
                  </ReviewProvider>
                </OrderProvider>
              </WishlistProvider>
            </LanguageProvider>
          </ThemeProvider>
        </Provider>
      </ConvexProvider>
    </ClerkProvider>
  );
}
