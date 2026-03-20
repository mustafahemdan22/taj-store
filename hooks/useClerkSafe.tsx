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

function UserButtonInner(props: ComponentProps<any>) {
  try {
    const { UserButton } = require("@clerk/nextjs");
    return <UserButton {...props} />;
  } catch {
    return null;
  }
}

export function SafeUserButton(props: ComponentProps<any>) {
  if (!clerkAvailable) return null;
  return <UserButtonInner {...props} />;
}

function SignInButtonInner(props: ComponentProps<any>) {
  try {
    const { SignInButton } = require("@clerk/nextjs");
    return <SignInButton {...props} />;
  } catch {
    return <button {...props}>{props.children || "Sign In"}</button>;
  }
}

export function SafeSignInButton(props: ComponentProps<any>) {
  return <SignInButtonInner {...props} />;
}

function SignUpButtonInner(props: ComponentProps<any>) {
  try {
    const { SignUpButton } = require("@clerk/nextjs");
    return <SignUpButton {...props} />;
  } catch {
    return <button {...props}>{props.children || "Sign Up"}</button>;
  }
}

export function SafeSignUpButton(props: ComponentProps<any>) {
  return <SignUpButtonInner {...props} />;
}