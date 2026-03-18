'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageProvider';

const BlogPage = () => {
  const { language } = useLanguage();

  const posts = [
    {
      id: 1,
      title: language === 'ar' ? 'أفضل طرق لتنسيق وشاحك مع إطلالاتك اليومية' : 'Top Ways to Style Your Scarf with Daily Outfits',
      excerpt: language === 'ar'
        ? 'تعلمي كيف تجعلين وشاحك جزءًا أنيقًا ومميزًا من كل إطلالة يومية مع taj_scarf.'
        : 'Learn how to make your scarf an elegant and standout part of every daily outfit with taj_scarf.',
      image: "https://res.cloudinary.com/dfq1xxerr/image/upload/v1772786069/taj-scarf/blog/3.jpg",
      href: '/blog/smart-shopping'
    },
    {
      id: 2,
      title: language === 'ar' ? 'دليل الأقمشة الفاخرة للأوشحة' : 'Luxury Fabrics Guide for Scarves',
      excerpt: language === 'ar'
        ? 'استكشف الفرق بين الحرير والكشمير والباشمينا واختر الأنسب من مجموعتنا الراقية.'
        : 'Discover the difference between silk, cashmere, and pashmina, and choose the perfect one from our premium collection.',
      image: "https://res.cloudinary.com/dfq1xxerr/image/upload/v1772786069/taj-scarf/blog/3.jpg",
      href: '/blog/produce'
    },
    {
      id: 3,
      title: language === 'ar' ? 'العناية بأوشحتك الفاخرة' : 'Caring for Your Luxury Scarves',
      excerpt: language === 'ar'
        ? 'تعلمي أفضل طرق العناية بأوشحتك للحفاظ على نعومتها وجودتها لسنوات طويلة مع taj_scarf.'
        : 'Learn the best ways to care for your scarves and maintain their softness and quality for years with taj_scarf.',
      image: "https://res.cloudinary.com/dfq1xxerr/image/upload/v1772786069/taj-scarf/blog/3.jpg",
      href: '/blog/storage'
    }
  ];

  return (
    <div className="min-h-screen bg-[#EEEFF1] dark:bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'مدونة taj_scarf' : 'taj_scarf Blog'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اقرأ أحدث المقالات حول الأوشحة الفاخرة، تنسيق الإطلالات، والعناية بالأقمشة الراقية.'
              : 'Read our latest articles on luxury scarves, outfit styling, and premium fabric care.'}
          </p>
        </motion.div>

        {/* Blog Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={index === 0}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-zinc-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="text-zinc-600 font-medium hover:underline"
                >
                  {language === 'ar' ? 'اقرأ المزيد →' : 'Read More →'}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;