"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageProvider";
import { getOptimizedCloudinaryUrl } from "@/utils/productImage";
import { CATEGORIES, categoryHeroImages } from "../convex/constants";
import { motion, Variants } from "framer-motion";

// ✅ قاموس ترجمة الأقسام (عشان الموقع يكون احترافي باللغتين)
const categoryTranslations: Record<string, { en: string; ar: string }> = {
  silk: { en: "Silk", ar: "حرير" },
  wool: { en: "Wool", ar: "صوف" },
  pashmina: { en: "Pashmina", ar: "باشمينا" },
  cotton: { en: "Cotton", ar: "قطن" },
  acrylic: { en: "Acrylic", ar: "أكريليك" },
  infinity: { en: "Infinity", ar: "إنفينيتي" },
  viscose: { en: "Viscose", ar: "فيسكوز" },
};

const CategoryGridStatic = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

 const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }, 
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0"
    >
      {CATEGORIES.map((slug) => {
        // جلب الاسم باللغة المناسبة، ولو مش موجود في القاموس نعرض الـ slug كبديل
        const translation = categoryTranslations[slug];
        const name = isArabic ? (translation?.ar || slug) : (translation?.en || slug);

        const heroPublicId = categoryHeroImages[slug];
        const imageUrl = heroPublicId ? getOptimizedCloudinaryUrl(heroPublicId, 1200) : "";

        return (
          <motion.div
            key={slug}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            // خلينا الكارت أطول شوية aspect-[3/4] بيدي شكل فخم جداً لصور الفاشون
            className="group relative aspect-[4/5] md:aspect-[5/6] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/40 transition-all duration-500 bg-neutral-100 border border-black/5"
          >
            <Link href={`/categories/${slug}`} className="block w-full h-full">
              <div className="relative w-full h-full overflow-hidden">
                
                {/* 1. الصورة مع تأثير الـ Blur قبل التحميل */}
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                    placeholder="blur"
                    // Blur Data URL لون رمادي خفيف جداً
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=" 
                  />
                )}

                {/* 2. التدرج اللوني (Overlay) - تم تحسينه ليكون أغمق من تحت ويدرج بنعومة لفوق */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

                {/* 3. المحتوى النصي - بيتحرك لفوق شوية مع الهوفر */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-center justify-end h-full">
                  <motion.div
                    className="flex flex-col items-center translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out"
                  >
                    <h3 className={`text-2xl md:text-3xl font-bold text-white text-center tracking-wide drop-shadow-lg capitalize ${isArabic ? 'font-arabic' : ''}`}>
                      {name}
                    </h3>
                    
                    {/* خط سفلي بيظهر بـ Animation مع الهوفر */}
                    <div className="h-[2px] bg-white/80 mt-3 w-0 group-hover:w-12 transition-all duration-500 ease-out rounded-full" />
                    
                    {/* كلمة "تسوق الآن" بتظهر بنعومة تحت الخط */}
                    <span className="text-white/90 text-sm font-medium mt-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 uppercase tracking-widest">
                      {isArabic ? "تسوق الآن" : "Shop Now"}
                    </span>
                  </motion.div>
                </div>

              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CategoryGridStatic;