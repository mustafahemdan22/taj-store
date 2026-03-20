// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
// const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isPublicRoute(req)) return;

//   if (isAdminRoute(req)) {
//     const session = await auth();

//     const role = (session?.sessionClaims?.publicMetadata as any)?.role;

//     // لو مش مسجّل دخول أو مش admin → redirect
//     if (!session?.userId || role !== "admin") {
//       return new Response(null, {
//         status: 302,
//         headers: { Location: "/" },
//       });
//     }
//   }
// });

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)"],
// };
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)' ,  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}