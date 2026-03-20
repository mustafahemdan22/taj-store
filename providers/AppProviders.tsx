"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { ReviewProvider } from "@/contexts/ReviewProvider";
import { WishlistProvider } from "@/contexts/WishlistProvider";
import { OrderProvider } from "@/contexts/OrderProvider";
import { Toaster } from "sonner";
import { store } from "@/store";
import { ClerkProvider } from "@clerk/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
}

if (!clerkPubKey) {
  throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

const convex = new ConvexReactClient(convexUrl);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
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