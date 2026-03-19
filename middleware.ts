import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// تحديد الصفحات الخاصة بالـ admin
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);

// إعداد الـ proxy middleware
const clerkProxy = clerkMiddleware(async (auth, req) => {
  // Check for public webhook routes
  if (isPublicRoute(req)) return;

  // لو مش صفحة admin، سيبها تعدي
  if (!isAdminRoute(req)) return;

  // لو Env Variables مش موجودة، متوقفش
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // لو مش مسجل دخول، رجعه لصفحة تسجيل الدخول
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const claims = sessionClaims as any;
  const role = claims?.publicMetadata?.role;

  // لو مش admin، رجعه للصفحة الرئيسية
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

// تصدير الـ proxy
export default function proxy(req: NextRequest, event: NextFetchEvent) {
  // لو المفتاح العام مش موجود، سيب الطلب يعدي
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }
  return clerkProxy(req, event);
}

// Config لتطبيق الـ middleware على كل الصفحات ما عدا _next والملفات الستاتيك
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};