"use client"

import { SignIn } from "@clerk/nextjs";
import { useLanguage } from "../../../contexts/LanguageProvider"; // تأكد من عدد النقاط للرجوع للمجلد الصحيح

export default function SigninPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-[80vh] bg-[#EEEFF1] dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className=" rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">Taj-Store</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === "ar" ? "تسجيل الدخول" : "Sign in to your account"}
        </h2>
      </div>

      <SignIn />
    </div>
  );
}