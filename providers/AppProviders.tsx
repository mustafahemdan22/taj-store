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
  if (typeof window !== "undefined") {
    console.error("NEXT_PUBLIC_CONVEX_URL is not defined. Please check your environment variables.");
  }
}

const convex = new ConvexReactClient(
  convexUrl || "https://merry-platypus-481.convex.cloud"    
);

function MaybeClerkProvider({ children }: { children: React.ReactNode }) {
  if (!clerkPubKey) {
    // Clerk key not available — render without auth (graceful degradation)
    return <>{children}</>;
  }
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {children}
    </ClerkProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MaybeClerkProvider>
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
    </MaybeClerkProvider>
  );
}