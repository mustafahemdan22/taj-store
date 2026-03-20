"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageProvider";
import { useRouter } from "next/navigation";
import { useState,  useMemo, useCallback } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiX, FiGrid, FiList } from "react-icons/fi";
import { useQuery } from "convex/react"; // ✅ FIXED: Import useQuery
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Product } from "@/types";
import CategoryGrid from "@/components/CategoryGrid";

// ✅ FIXED: Custom hook for products query
const useProducts = () => useQuery(api.functions.products.getProducts);


// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  language: "ar" | "en";
  isRTL: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, language, isRTL }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;
    pages.push(1);
    if (currentPage > delta + 2) pages.push("...");
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - delta - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 "
    >
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-zinc-500 hover:to-zinc-600 hover:text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
        aria-label={language === "ar" ? "الصفحة السابقة" : "Previous page"}
      >
        {isRTL ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
      </motion.button>

      <div className="flex gap-1 flex-wrap justify-center">
        {pageNumbers.map((page, index) => {
          if (page === "...") return <span key={`dots-${index}`} className="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono select-none">...</span>;

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <motion.button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              whileHover={{ scale: isActive ? 1.05 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[48px] px-4 py-3 rounded-xl font-bold shadow-md transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-zinc-600 to-zinc-700 text-white shadow-zinc-500/40 hover:shadow-zinc-600/60"
                  : "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-gray-700/80 hover:shadow-lg"
              }`}
            >
              {pageNum}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-zinc-500 hover:to-zinc-600 hover:text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
        aria-label={language === "ar" ? "الصفحة التالية" : "Next page"}
      >
        {isRTL ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
      </motion.button>
    </motion.div>
  );
};

// Main Page
const CategoriesPage = () => {
  const { language, isRTL } = useLanguage();
  const router = useRouter();

  // ✅ FIXED: Use Convex React hook
  const products = useProducts();
  const categories = useQuery(api.functions.categories.listCategories, {});

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Dynamic categories from Convex
  const categoriesList = useMemo(() => {
    return (categories || []).map((c: Doc<"categories">) => ({
      id: c.slug,
      name: language === "ar" ? c.name : c.nameEn,
      nameEn: c.nameEn,
    }));
  }, [categories, language]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let list = selectedCategory === "all" 
      ? products 
      : products.filter((p: Product) => p.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((p: Product) =>
        p.name.toLowerCase().includes(query) ||
        (p.nameEn?.toLowerCase() || "").includes(query) ||
        (p.description?.toLowerCase() || "").includes(query) ||
        (p.descriptionEn?.toLowerCase() || "").includes(query) ||
        (p.brand?.toLowerCase() || "").includes(query) ||
        p.category.includes(query)
      );
    }
    return list;
  }, [products, selectedCategory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    router.push(`/categories/${categoryId}`);
  }, [router]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  // Loading state
  if (products === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D1D5DC] dark:bg-gray-900  py-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }} 
            className="text-xl lg:text-2xl my-20 text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed px-4 font-light tracking-wide"
          >
            {language === "ar"
              ? "اكتشفي مجموعتنا الحصرية من الأوشحة الفاخرة المصنوعة يدوياً بأجود أنواع الكشمير والحرير والصوف الطبيعي، مصممة بعناية لتعكس أناقتك الفريدة في كل مناسبة."
              : "Discover our exclusive collection of handcrafted luxury scarves made from the finest cashmere, silk, and natural wool, meticulously designed to reflect your unique elegance on every occasion."}
          </motion.p>
        </motion.section>

        {/* Search & View Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            <div className="flex items-center gap-2 p-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {language === "ar" ? "عرض:" : "Show:"}
              </label>
              <select  
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-zinc-500 font-semibold cursor-pointer transition-all shadow-sm"
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
              </select>
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => handleSearchChange(e.target.value)} 
                placeholder={language === "ar" ? "ابحث بالاسم، الوصف، أو العلامة التجارية..." : "Search by name, description, or brand..."} 
                className={`w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 bg-white/80 dark:bg-gray-800/80 text-lg shadow-xl backdrop-blur-sm transition-all duration-300 ${isRTL ? "pr-14 pl-16" : "pl-16 pr-14"}`} 
              />
              <FiSearch className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 transition-all ${isRTL ? "right-5" : "left-5"}`} />
              {searchQuery && (
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={clearSearch} 
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 ${isRTL ? "left-4" : "right-4"}`}
                >
                  <FiX className="w-6 h-6" />
                </motion.button>
              )}
            </div>

            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1 p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <motion.button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-zinc-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <FiGrid className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  onClick={() => setViewMode("list")} 
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-zinc-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <FiList className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <div className="flex items-center gap-3 mb-6 justify-center flex-wrap">
            <FiFilter className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
            {categoriesList.map((category) => (
              <motion.button 
                key={category.id} 
                onClick={() => handleCategoryChange(category.id)} 
                whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} 
                whileTap={{ scale: 0.98 }} 
                className={`group relative px-3 py-2 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 overflow-hidden ${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-br from-zinc-700 via-zinc-800 to-black text-white shadow-zinc-500/50 ring-4 ring-zinc-400/30" 
                    : "bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-xl"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span>{language === "ar" ? category.name : category.nameEn || category.name}</span>
                </span>
                {selectedCategory === category.id && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-zinc-600 to-zinc-800 opacity-20" 
                    layoutId="category-active-bg" 
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.section layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative mb-16">
       <CategoryGrid />
        </motion.section>
        

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <Pagination 
          
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
            language={language} 
            isRTL={isRTL} 
          />
          
        )} */}
      </div>
    </div>
  );
};

export default CategoriesPage;
