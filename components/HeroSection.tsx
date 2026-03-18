"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingBag, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageProvider";
import style from "./HeroSection.module.css";
import { useRef } from "react";
import { getOptimizedCloudinaryUrl } from "@/utils/productImage";

const HERO_PUBLIC_ID = "taj-scarf/other/hero";

const HeroSection = () => {
  const { language, isRTL } = useLanguage();
  const ref = useRef(null);
  const heroImageUrl = getOptimizedCloudinaryUrl(HERO_PUBLIC_ID, 1920);

  return (
    <section
      ref={ref}
      className={style.hero}
 style={{
    backgroundImage: `url("https://res.cloudinary.com/dfq1xxerr/image/upload/v1773467746/hero.jpg")`,
  }}    >
      
      <div className={style.lear}>

      <div className={`${style.heroContent} relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isRTL ? "lg:order-2" : ""}`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-black mb-8 leading-[1.1] tracking-tighter"
            >
              <span className={style.span}>
                {language === "ar" ? "تاج سكارف" : "Taj Scarf"}
              </span>
              <br />
              <span className="text-2xl md:text-4xl font-sans font-light tracking-[0.3em] uppercase text-zinc-400 mt-4 block">
                {language === "ar" ? "الفخامة في كل قطعة" : "Luxury in every piece"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl mb-12 text-zinc-400 font-sans leading-relaxed tracking-wide max-w-xl"
            >
              {language === "ar"
                ? "اكتشف مجموعتنا الحصرية من الأوشحة المصنوعة يدوياً من أرقى الأقمشة العالمية"
                : "Discover our exclusive collection of handcrafted luxury scarves made from the world's finest fabrics."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-800 font-semibold rounded-lg hover:bg-zinc-100 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
              >
                <FiShoppingBag className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === "ar" ? "تسوق الآن" : "Explore Collection"}
                {isRTL ? (
                  <FiArrowLeft className="w-5 h-5 ml-2" />
                ) : (
                  <FiArrowRight className="w-5 h-5 ml-2" />
                )}
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-zinc-800 transition-all duration-200"
              >
                {language === "ar" ? "قصتنا" : "Our Story"}
              </Link>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${isRTL ? "lg:order-1" : ""}`}
          >
            <div className="relative">
              <motion.div
                animate={{ y: [-1, 15, -1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-64 h-64 mx-auto"
              >
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
