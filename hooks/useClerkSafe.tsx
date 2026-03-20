'use client';

import { useSafeUser } from "./useClerkUser";
import type { ComponentProps, ReactNode } from "react";

const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Safe wrappers for Clerk components.
 * When ClerkProvider is absent (no publishable key), these render
 * nothing or the fallback instead of crashing the React tree.
 *
 * Uses inner components to avoid calling hooks conditionally
 * (which violates React's rules of hooks).
 */

function SignedInInner({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useSafeUser();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}

export function SafeSignedIn({ children }: { children: ReactNode }) {
  if (!clerkAvailable) return null;
  return <SignedInInner>{children}</SignedInInner>;
}

function SignedOutInner({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useSafeUser();
  if (isLoaded && isSignedIn) return null;
  return <>{children}</>;
}

export function SafeSignedOut({ children }: { children: ReactNode }) {
  if (!clerkAvailable) return <>{children}</>;
  return <SignedOutInner>{children}</SignedOutInner>;
}

// ---------------- Buttons ---------------- //

import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export function SafeUserButton(props: ComponentProps<typeof UserButton>) {
  if (!clerkAvailable) return null;
  return <UserButton {...props} />;
}

export function SafeSignInButton(props: ComponentProps<typeof SignInButton>) {
  if (!clerkAvailable) return <button {...(props as any)}>{props.children || "Sign In"}</button>;
  return <SignInButton {...props} />;
}

export function SafeSignUpButton(props: ComponentProps<typeof SignUpButton>) {
  if (!clerkAvailable) return <button {...(props as any)}>{props.children || "Sign Up"}</button>;
  return <SignUpButton {...props} />;
}