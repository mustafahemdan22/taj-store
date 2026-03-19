
import { useSafeUser } from "./useClerkUser";

const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Safe wrappers for Clerk components.
 * When ClerkProvider is absent (no publishable key), these render
 * nothing or the fallback instead of crashing the React tree.
 *
 * Uses inner components to avoid calling hooks conditionally
 * (which violates React's rules of hooks).
 */

function SignedInInner({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useSafeUser();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}

export function SafeSignedIn({ children }: { children: React.ReactNode }) {
  if (!clerkAvailable) return null;
  return <SignedInInner>{children}</SignedInInner>;
}

function SignedOutInner({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useSafeUser();
  // If Clerk is not loaded yet, we still show the buttons as a fallback
  // instead of leaving the navbar empty. If it loads and user is signed in,
  // this will then return null.
  if (isLoaded && isSignedIn) return null;
  return <>{children}</>;
}

export function SafeSignedOut({ children }: { children: React.ReactNode }) {
  if (!clerkAvailable) {
    return <>{children}</>;
  }
  return <SignedOutInner>{children}</SignedOutInner>;
}

function UserButtonInner(props: { afterSignOutUrl?: string }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { UserButton } = require("@clerk/nextjs");
    return <UserButton {...props} />;
  } catch {
    return null;
  }
}

export function SafeUserButton(props: { afterSignOutUrl?: string }) {
  if (!clerkAvailable) return null;
  return <UserButtonInner {...props} />;
}
