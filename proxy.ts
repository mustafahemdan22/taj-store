import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  if (isAdminRoute(req)) {
    const session = await auth();

    const role = (session?.sessionClaims?.publicMetadata as any)?.role;

    // لو مش مسجّل دخول أو مش admin → redirect
    if (!session?.userId || role !== "admin") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};