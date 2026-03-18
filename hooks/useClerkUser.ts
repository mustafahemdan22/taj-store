"use client";

import { useUser as useClerkUseUser } from "@clerk/nextjs";

/**
 * Safe wrapper around Clerk's useUser hook.
 * Returns null/false defaults if ClerkProvider is not mounted
 * (e.g., when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing on Vercel Preview).
 */
export function useSafeUser() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useClerkUseUser();
  } catch {
    return {
      user: null,
      isLoaded: true,
      isSignedIn: false,
    };
  }
}
