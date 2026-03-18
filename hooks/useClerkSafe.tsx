"use client";

import { useSafeUser } from "./useClerkUser";

const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Safe wrappers for Clerk components.
 * When ClerkProvider is absent (no publishable key), these render
 * nothing or the fallback instead of crashing the React tree.
 */

export function SafeSignedIn({ children }: { children: React.ReactNode }) {
  if (!clerkAvailable) return null;
  // Dynamically import to avoid the hook call when Clerk isn't available
  const { isSignedIn } = useSafeUser();
  if (!isSignedIn) return null;
  return <>{children}</>;
}

export function SafeSignedOut({ children }: { children: React.ReactNode }) {
  if (!clerkAvailable) {
    // No Clerk = treat everyone as signed out
    return <>{children}</>;
  }
  const { isLoaded, isSignedIn } = useSafeUser();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}

export function SafeUserButton(props: { afterSignOutUrl?: string }) {
  if (!clerkAvailable) return null;
  // Only import the real UserButton when Clerk is available
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { UserButton } = require("@clerk/nextjs");
    return <UserButton {...props} />;
  } catch {
    return null;
  }
}
