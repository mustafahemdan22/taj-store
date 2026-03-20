"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiHeart,
  FiArrowLeft,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiShare2,

} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { addToCart, updateQuantity } from "../../../store/cartSlice";
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useWishlist } from "../../../contexts/WishlistProvider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Product, CartItem } from "../../../types/index";
import ProductReviews from "../../../components/ProductReviews";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { getProductImages } from "../../../utils/productImage";

const ProductDetailPage = () => {
  const params = useParams();
  const { language, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const productId = typeof params.id === 'string' ? params.id : '';

  // Use focused query for single product
  const product = useQuery(api.functions.products.getProductById, { productId }) as Product | null;

  const productImages = useMemo(() => {
    return getProductImages(product as Product);
  }, [product]);

  const isLoading = product === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEEFF1] dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
              </div>
              <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EEEFF1] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FiShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-900 transition-colors duration-200"
          >
            {isRTL ? (
              <>
                {language === "ar" ? "العودة للمنتجات" : "Back to Products"}
                <FiArrowLeft className="w-5 h-5 mr-2 rotate-180" />
              </>
            ) : (
              <>
                <FiArrowLeft className="w-5 h-5 mr-2" />
                {language === "ar" ? "العودة للمنتجات" : "Back to Products"}
              </>
            )}
          </Link>
        </div>
      </div>
    );
  }


  const productImage = productImages[selectedImage] || productImages[0];
  const productName = (language === "ar" ? product.name : product.nameEn) || "Product";
  const productDescription =
    (language === "ar" ? product.description : product.descriptionEn) || "";
  const productSubtitle = product.subtitle;

  const pid = product._id;
  const cartItem = cartItems.find((item: CartItem) => item.product._id === pid);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(pid);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(
      language === "ar"
        ? `تم إضافة ${quantity} من ${productName} إلى السلة`
        : `${quantity} ${productName} added to cart`,
    );
    setQuantity(1);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) return;

    if (product.stock && newQuantity > product.stock) {
      toast.error(
        language === "ar"
          ? `الحد الأقصى ${product.stock}`
          : `Maximum ${product.stock} available`
      );
      return;
    }

    dispatch(updateQuantity({ id: pid, quantity: newQuantity }));
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    toast.success(
      language === "ar"
        ? isWishlisted
          ? "تم إزالة المنتج من المفضلة"
          : "تم إضافة المنتج للمفضلة"
        : isWishlisted
        ? "Removed from wishlist"
        : "Added to wishlist",
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: productDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        language === "ar" ? "تم نسخ الرابط" : "Link copied to clipboard"
      );
    }
  };

  const features = [
    {
      icon: FiTruck,
      title: language === "ar" ? "توصيل سريع" : "Fast Delivery",
      description: language === "ar" ? "توصيل خلال 24 ساعة" : "Delivery within 24 hours",
    },
    {
      icon: FiShield,
      title: language === "ar" ? "جودة مضمونة" : "Quality Guaranteed",
      description: language === "ar" ? "منتجات مضمونة 100%" : "100% guaranteed products",
    },
    {
      icon: FiRefreshCw,
      title: language === "ar" ? "إرجاع مجاني" : "Free Returns",
      description: language === "ar" ? "إرجاع مجاني خلال 7 أيام" : "Free returns within 7 days",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#EEEFF1] dark:bg-gray-900 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link
              href="/categories"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              {language === "ar" ? "المنتجات" : "Products"}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {productName}
            </span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden relative group border border-gray-100 dark:border-gray-800">
              {productImage ? (
                <Image
                  src={productImage}  
                  alt={productName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 m-2 rounded-2xl">
                  <span className="text-gray-400 dark:text-gray-500 font-semibold text-sm uppercase tracking-wider text-center px-4">
                    Image Coming Soon
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              
              {/* Category Label */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl z-10 border border-white/20">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">{product.category || "General"}</span>
              </div>

              {/* Dynamic Badge */}
              {product.badge && (
                <div className="absolute top-6 right-6 px-4 py-2 bg-zinc-900 border border-zinc-700 backdrop-blur-md rounded-xl shadow-xl z-10">
                  <span className="text-sm font-bold text-white tracking-wider">{product.badge}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-4 mt-6">
                {productImages.map((img: string, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md ${
                      selectedImage === idx 
                        ? "border-zinc-800 dark:border-zinc-300 ring-2 ring-zinc-500/20" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 lg:max-w-lg"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {productName}
              </h1>
              {productSubtitle && (
                <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-4">
                  {productSubtitle}
                </h2>
              )}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 transition-colors ${
                        star <= Math.floor(product.rating || 4)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.rating?.toFixed(1) || "4.0"}) • {product.reviews || 12}{" "}
                  {language === "ar" ? "تقييم" : "reviews"}
                </span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-zinc-800 dark:text-zinc-300">
                  {product.dynamicPrice ? product.dynamicPrice : product.price.toFixed(0)}
                </span>
                {!product.dynamicPrice && (
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                )}
              </div>

              {product.stock !== undefined && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                  }`}
                >
                  {product.stock > 0
                    ? language === "ar"
                      ? `(${product.stock}) متوفر`
                      : `In Stock (${product.stock})`
                    : language === "ar"
                    ? "نفدت الكمية"
                    : "Out of Stock"}
                </span>
              )}
            </div>

            {/* Brand & Category */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{product.brand}</span>
              <span>{language === "ar" ? product.category : product.category}</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {language === "ar" ? "الوصف" : "Description"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {productDescription}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {language === "ar" ? "الكمية:" : "Quantity:"}
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4 text-black dark:text-white" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg text-gray-900 dark:text-white min-w-[72px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || Infinity, quantity + 1))
                    }
                    className="p-3 hover: dark:hover:bg-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    disabled={product.stock !== undefined && quantity >= product.stock}
                  >
                    <FiPlus className="w-4 h-4  text-black dark:text-white" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white font-bold py-4 px-8 rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed active:scale-95 shadow-2xl hover:shadow-3xl text-lg"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span>{language === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl ${
                    isWishlisted
                      ? "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-red-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                >
                  <FiHeart
                    className={`w-6 h-6 transition-all ${isWishlisted ? "fill-red-500" : ""}`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500 hover:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                  title={language === "ar" ? "مشاركة المنتج" : "Share Product"}
                >
                  <FiShare2 className="w-6 h-6" />
                </button>
              </div>

              {/* In Cart Indicator */}
              {currentQuantity > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-5 rounded-2xl border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <FiShoppingCart className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-lg font-bold  bg-gradient-to-r from-zinc-800 to-zinc-900 text-white font-bold py-4 px-8 rounded-xl hover:from-zinc-900 hover:to-black transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed active:scale-95 shadow-2xl hover:shadow-3xl text-lg ">
                          {language === "ar" ? "في السلة:" : "In Cart:"}
                        </span>
                        <span className="text-2xl font-black text-emerald-600 ml-2">
                          {currentQuantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                        className="p-2 rounded-xl bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        <FiMinus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                        className="p-2 rounded-xl bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {language === "ar" ? "المميزات" : "Features"}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={pid} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
