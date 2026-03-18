'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/index';
import { useAppDispatch } from '../hooks/redux';
import { addToCart } from '../store/cartSlice';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageProvider';
import { useWishlist } from "../contexts/WishlistProvider";
import { getProductImageUrl } from '../utils/productImage';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { language } = useLanguage();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  // الحالة دي هي اللي هتنقذنا لو الصورة مش موجودة
  const [imageError, setImageError] = useState(false);

  const productName = (language === 'ar' ? product.name : product.nameEn) || 'Product';
  const productDescription = language === 'ar' ? product.description : product.descriptionEn;
  const productId = product._id;
  const isWishlisted = isInWishlist(productId);

  const resolvedImage = getProductImageUrl(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart(product));
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${productName} إلى السلة` 
        : `${productName} added to cart`
    );
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product);
    toast.success(
      language === 'ar'
        ? isWishlisted
          ? 'تم إزالة المنتج من المفضلة'
          : 'تم إضافة المنتج للمفضلة'
        : isWishlisted
          ? 'Removed from wishlist'
          : 'Added to wishlist'
    );
  };

  return (
    <Link href={`/products/${productId}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700"
      >
        {/* Product Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {resolvedImage && !imageError ? (
            <Image
              src={resolvedImage}
              alt={productName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)} // لما الصورة تفشل، المتغير ده هيبقى true
              loading="lazy"
            />
          ) : (
            // الـ div ده هيظهر مكان المنتجات الوهمية اللي ملهاش صور
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl m-2">
              <span className="text-gray-400 dark:text-gray-600 font-bold text-xs uppercase tracking-tighter">
                Image Coming Soon
              </span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.badge && (
              <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {product.badge}
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -{product.discount}%
              </span>
            )}
            {product.stock !== undefined && product.stock === 0 && (
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg z-10 ${
              isWishlisted
                ? 'bg-red-500 text-white opacity-100'
                : 'bg-white dark:bg-gray-800 text-red-500 opacity-0 group-hover:opacity-100'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)]">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-zinc-700 text-white px-5 py-2.5 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>{language === 'ar' ? 'أضف للسلة' : 'Quick Add'}</span>
            </motion.button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name & Subtitle */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 min-h-[1.5rem] group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
            {productName}
          </h3>
          {product.subtitle && (
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
              {product.subtitle}
            </p>
          )}

          {/* Description */}
          {productDescription && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {productDescription}
            </p>
          )}

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.rating}
              </span>
              {product.reviews && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.reviews})
                </span>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-700 dark:text-zinc-500">
                  {product.dynamicPrice ? product.dynamicPrice : product.price.toFixed(2)}
                </span>
                {!product.dynamicPrice && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? '' : 'EGP'}
                  </span>
                )}
              </div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  {product.compareAtPrice.toFixed(2)}
                </span>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {product.unit}
              </div>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="text-xs">
                {product.stock > 0 ? (
                  <span className="text-zinc-700 dark:text-zinc-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-zinc-700 dark:bg-zinc-400 rounded-full"></span>
                    {language === 'ar' ? 'متوفر' : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></span>
                    {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-zinc-700 text-white py-3 rounded-lg font-semibold hover:bg-zinc-800 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-400 shadow-md hover:shadow-lg"
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>
              {product.stock === 0
                ? language === 'ar'
                  ? 'غير متوفر'
                  : 'Out of Stock'
                : language === 'ar'
                  ? 'أضف للسلة'
                  : 'Add to Cart'}
            </span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;