import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const claims = sessionClaims as any;
  const role = claims?.publicMetadata?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  // Production-safe: during builds/misconfig, don't hard-fail.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }
  return clerk(req, event);
}

export const config = {
  matcher: [
    // Run on all routes except Next internals & static assets.
    "/((?!_next|.*\\..*).*)",
  ],
};

