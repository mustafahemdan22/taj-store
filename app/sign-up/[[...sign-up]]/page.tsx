// src/app/sign-up/[[...sign-up]]/page.tsx

import { SignUp } from "@clerk/nextjs";
import { useLanguage } from "../../../contexts/LanguageProvider"; // تأكد من عدد النقاط للرجوع للمجلد الصحيح

export default function SignupPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-[80vh] bg-[#EEEFF1] dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">🧣</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === "ar" ? "إنشاء حساب جديد" : "Create a new account"}
        </h2>
      </div>

      {/* أزلنا routing="hash" ليعتمد على المسارات التي وضعتها في الـ env */}
      <SignUp />
    </div>
  );
}