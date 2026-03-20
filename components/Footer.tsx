"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiPackage,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageProvider";

const Footer = () => {
  const { language } = useLanguage();

  const quickLinks = [
    { href: "/", text: language === "ar" ? "الرئيسية" : "Home" },
    { href: "/about", text: language === "ar" ? "قصتنا" : "Our Story" },
    { href: "/blog", text: language === "ar" ? "المدونة" : "Journal" },
    { href: "/contact", text: language === "ar" ? "تواصل معنا" : "Contact" },
    { href: "/categories", text: language === "ar" ? "المجموعات" : "Collections" },
  ];

  const categories = [
    {
      href: "/categories/silk",
      text: language === "ar" ? "حرير" : "Silk",
    },
    {
      href: "/categories/wool",
      text: language === "ar" ? "صوف" : "Wool",
    },
    {
      href: "/categories/pashmina",
      text: language === "ar" ? "باشمينا" : "Pashmina",
    },
    {
      href: "/categories/acrylic",
      text: language === "ar" ? "الأكريليك" : "Acrylic",
    },
    {
      href: "/categories/cotton",
      text: language === "ar" ? "قطن" : "cotton",
    },
  ];

  return (
    <footer className="bg-[#D1D5DC] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                {language === "ar" ? "تاج سكارف" : "Taj Scarf"}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {language === "ar"
                ? "وجهتك المثالية للأوشحة الفاخرة — تصاميم حصرية مصنوعة يدوياً من أرقى الأقمشة العالمية"
                : "Your destination for luxury scarves — exclusive handcrafted designs from the world's finest fabrics"}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={language === "ar" ? "فيسبوك" : "Facebook"}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <FiFacebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={language === "ar" ? "واتساب" : "WhatsApp"}
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-all duration-300 transform hover:scale-110"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li className='transition-all duration-300 transform hover:scale-110' key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-150 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
           
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {language === "ar" ? "المجموعات" : "Collections"}
            </h3>
            <ul className="space-y-2 ">
              {categories.map((category) => (
                <li className='transition-all duration-300 transform hover:scale-110'   key={category.href}> 
                  <Link
                    href={category.href}
                    className="  text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-150 text-sm"
                  >
                    {category.text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {language === "ar" ? "تواصل معنا" : "Contact"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FiMapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {language === "ar" ? "الاسكندريه" : "Cairo, Egypt"}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FiPhone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">+20 1553947102</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FiMail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">[EMAIL_ADDRESS]</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm"
        >
        <p className="text-gray-700 dark:text-gray-300">
  {language === "ar"
    ? "© 2026 تاج سكارف. جميع الحقوق محفوظة. تم تطوير الموقع بواسطة مصطفى حمدان."
    : "© 2026 Taj Scarf. All rights reserved. Developed by Mostafa Hamdan."}
</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;