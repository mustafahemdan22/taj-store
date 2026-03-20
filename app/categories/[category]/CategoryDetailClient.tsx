"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { useMemo } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getOptimizedCloudinaryUrl } from "@/utils/productImage";

type Category = {
  slug: string;
  name: string;
  nameEn: string;
  heroImagePublicId: string;
};

export default function CategoryDetailClient({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const { language, isRTL } = useLanguage();

  const categoryName = useMemo(() => {
    return language === "ar" ? category.name : category.nameEn;
  }, [category.name, category.nameEn, language]);
  const heroUrl = useMemo(() => {
    // 1. لو المسار موجود في قاعدة البيانات، ابعته للدالة
    if (category?.heroImagePublicId) {
      return getOptimizedCloudinaryUrl(category.heroImagePublicId, 1200);
    }
    // 2. لو مفيش مسار، رجع أي صورة بديلة عندك في مجلد public
    // (تقدر تغير /placeholder.jpg لأي صورة موجودة عندك فعلاً)
    return "/placeholder.jpg";
  }, [category?.heroImagePublicId]);
  return (
    <div
      className="min-h-screen bg-[#D1D5DC] dark:bg-gray-900 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl group"
        >
          <Image
            src={heroUrl as string}
            alt={categoryName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div
            className={`absolute bottom-0 ${isRTL ? "right-0" : "left-0"
              } p-8 md:p-12 w-full`}
          >
            <Link
              href="/categories"
              className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors mb-4 group/link"
            >
              <FiArrowLeft
                className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"
                  } group-hover/link:-translate-x-1 transition-transform`}
              />
              {language === "ar" ? "العودة للفئات" : "Back to Categories"}
            </Link>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <h1 className="text-4xl md:text-7xl font-black text-white capitalize drop-shadow-lg">
                {categoryName}
              </h1>
            </motion.div>

            <p className="text-white/80 mt-4 text-lg md:text-xl max-w-2xl font-light">
              {language === "ar"
                ? `اكتشف مجموعتنا المختارة من ${categoryName} الفاخرة`
                : `Explore our curated selection of premium ${categoryName} scarves`}
            </p>
          </div>
        </motion.div>

        {/* Products header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1 bg-zinc-500 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "المنتجات المتاحة" : "Available Products"}
            </h2>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: Product, index: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiFilter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "لم يتم العثور على منتجات" : "No products found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar"
                ? "حاول تغيير خيارات البحث الخاصة بك"
                : "Try adjusting your search criteria"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

