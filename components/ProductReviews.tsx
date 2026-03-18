'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useReviews } from '../contexts/ReviewProvider';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '../contexts/LanguageProvider';
import { FiStar, FiThumbsUp, FiEdit3, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const {  addReview, getReviewsByProduct, getAverageRating, getRatingDistribution, markHelpful } = useReviews();
  const { user } = useUser();
  const { language } = useLanguage();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: 'ssssssssssssssssssssssssss',
    comment: ''
  });

  const productReviews = getReviewsByProduct(productId);
  const averageRating = getAverageRating(productId);
  const ratingDistribution = getRatingDistribution(productId);
  const totalReviews = productReviews.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    addReview({
      productId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment
    });

    setReviewForm({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
    toast.success(language === 'ar' ? 'تم إضافة التقييم بنجاح!' : 'Review added successfully!');
  };

  const handleMarkHelpful = (reviewId: string) => {
    markHelpful(reviewId);
    toast.success(language === 'ar' ? 'شكراً لك!' : 'Thank you!');
  };

  return (
    <div className="mt-8">
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
          </h2>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({totalReviews} {language === 'ar' ? 'تقييم' : 'reviews'})
            </span>
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors duration-200"
          >
            <FiEdit3 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === 'ar' ? 'كتابة تقييم' : 'Write Review'}
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      {totalReviews > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'توزيع التقييمات' : 'Rating Distribution'}
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                  {rating}
                </span>
                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'كتابة تقييم' : 'Write a Review'}
          </h3>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'التقييم' : 'Rating'}
              </label>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <FiStar
                      className={`w-6 h-6 ${
                        star <= reviewForm.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'عنوان التقييم' : 'Review Title'}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={reviewForm.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={language === 'ar' ? 'اكتب عنوان التقييم' : 'Write review title'}
              />
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'التعليق' : 'Comment'}
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                required
                value={reviewForm.comment}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder={language === 'ar' ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                type="submit"
                className="px-6 py-3 bg-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors duration-200"
              >
                {language === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-[#EEEFF1] dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {productReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUser className="w-5 h-5 text-zinc-700 dark:text-zinc-400" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {review.userName}
                  </h4>
                  {review.verified && (
                    <span className="px-2 py-1 bg-zinc-200 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-medium rounded-full">
                      {language === 'ar' ? 'مؤكد' : 'Verified'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  {review.title}
                </h5>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {review.comment}
                </p>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors duration-200"
                  >
                    <FiThumbsUp className="w-4 h-4" />
                    <span>{language === 'ar' ? 'مفيد' : 'Helpful'}</span>
                    <span>({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {totalReviews === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FiStar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? 'لا توجد تقييمات بعد' : 'No Reviews Yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' 
              ? 'كن أول من يقيم هذا المنتج' 
              : 'Be the first to review this product'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;


