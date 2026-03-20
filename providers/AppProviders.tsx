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

// ✅ URL الخاص بـ Convex backend (من env)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// ✅ Clerk publishable key (Authentication)
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// ❗ لو Convex URL مش موجود → التطبيق مش هيعرف يجيب أو يبعت بيانات
if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
}

// ❗ لو Clerk key مش موجود → تسجيل الدخول مش هيشتغل
if (!clerkPubKey) {
  throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

// ✅ إنشاء client للتعامل مع Convex API
const convex = new ConvexReactClient(convexUrl);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // ✅ ClerkProvider: مسؤول عن Authentication (SignIn / SignUp / User)
    <ClerkProvider publishableKey={clerkPubKey}>
      
      {/* ✅ ConvexProvider: بيربط الفرونت بالـ backend (database + functions) */}
      <ConvexProvider client={convex}>
        
        {/* ✅ Redux Provider: لإدارة state global */}
        <Provider store={store}>
          
          {/* 🎨 Theme (Light / Dark mode) */}
          <ThemeProvider>
            
            {/* 🌐 Language (AR / EN) */}
            <LanguageProvider>
              
              {/* ❤️ Wishlist state */}
              <WishlistProvider>
                
                {/* 🛒 Orders / Cart management */}
                <OrderProvider>
                  
                  {/* ⭐ Reviews system */}
                  <ReviewProvider>
                    
                    {/* 📦 كل صفحات التطبيق */}
                    {children}

                    {/* 🔔 Toast notifications */}
                    <Toaster position="top-center" />
                  
                  </ReviewProvider>
                </OrderProvider>
              </WishlistProvider>
            </LanguageProvider>
          </ThemeProvider>
        
        </Provider>
      </ConvexProvider>
    </ClerkProvider>
  );
}