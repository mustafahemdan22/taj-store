

import { SignIn } from "@clerk/nextjs";
import { useLanguage } from "../../../contexts/LanguageProvider";

export default function LoginPage() {
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
          {language === "ar" ? "مرحباً بك في تاج سكارف" : "Welcome to Taj Scarf"}
        </h2>
      </div>

      {/* Clerk SignIn Component takes care of everything (Google, Email, Password, UI) */}
      <SignIn />
    </div>
  );
}