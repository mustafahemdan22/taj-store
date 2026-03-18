'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageProvider';
import Image from "next/image";

const AboutPage = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: FiTarget,
      title: language === 'ar' ? 'رؤيتنا' : 'Our Vision',
      description: language === 'ar' 
        ? 'نسعى لنكون الوجهة الأولى للأوشحة الفاخرة المصنوعة يدوياً بأرقى معايير الجودة.' 
        : 'To be the premier destination for handcrafted luxury scarves of the finest quality'
    },
    {
      icon: FiUsers,
      title: language === 'ar' ? 'رسالتنا' : 'Our Mission',
      description: language === 'ar' 
        ? 'نقدم أرقى الأوشحة من أفخم الأقمشة العالمية مع تجربة تسوق استثنائية.' 
        : 'Delivering the finest scarves from the world\'s most luxurious fabrics with an exceptional experience'
    },
    {
      icon: FiAward,
      title: language === 'ar' ? 'جودتنا' : 'Our Quality',
      description: language === 'ar' 
        ? 'كل قطعة تمر بفحص دقيق لضمان أعلى مستويات الصناعة والجودة.' 
        : 'Every piece undergoes meticulous inspection to ensure the highest standards of craftsmanship'
    },
    {
      icon: FiHeart,
      title: language === 'ar' ? 'قيمنا' : 'Our Values',
      description: language === 'ar' 
        ? 'التميز، الأصالة، والاهتمام بكل تفصيلة هي أساس عملنا.' 
        : 'Excellence, authenticity, and attention to every detail define who we are'
    }
  ];

  return (
    <div className="min-h-screen bg-[#D1D5DC] dark:bg-gray-900 py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'من نحن' : 'About Us'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'تاج سكارف هي علامة تجارية فاخرة متخصصة في الأوشحة المصنوعة يدوياً من أرقى الأقمشة العالمية، تجمع بين الأناقة والإبداع في كل قطعة.' 
              : 'Taj Scarf is a luxury brand specializing in handcrafted scarves from the world\'s finest fabrics, merging elegance with artistry in every piece.'
            }
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
whileHover={{ boxShadow: "0 0 25px rgba(161,161,170,0.5)" }}
          className="bg-white dark:bg-gray-800 rounded-br-full  mb-16 shadow-md hover:shadow-2xl transition-all duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'ar' ? 'قصتنا' : 'Our Story'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {language === 'ar' 
                  ? 'بدأت قصتنا من شغف عميق بالأقمشة الفاخرة والحرفية اليدوية. نختار كل قماش بعناية فائقة من أفضل المصادر حول العالم.' 
                  : 'Our journey began from a deep passion for fine fabrics and artisan craftsmanship. Each fabric is carefully selected from the finest sources around the world.'
                }
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' 
                  ? 'نؤمن بأن كل قطعة تستحق أن تكون استثنائية، وهذا ما نسعى لتحقيقه في كل تصميم.' 
                  : 'We believe every piece deserves to be extraordinary, and that\'s what we strive to achieve in every design.'
                }
              </p>
            </div>
            <div className="relative  h-80 w-full ">
             <Image 
  src="https://res.cloudinary.com/dfq1xxerr/image/upload/v1773724121/about_c0qoki.jpg" 
  alt="Taj Scarf" 
  fill 
  className="object-center object-cover rounded-br-full"
/>

              {/* <div className="absolute inset-0 bg-[rgba(0,0,0,0.)]"></div> */}
            </div>
          </div>
        </motion.div>

       {/* Values Grid */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
>
  {values.map((value, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: "easeInOut" }}
whileHover={{ boxShadow: "0 0 25px rgba(161,161,170,0.5)" }}
      className="relative group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-70 flex flex-col items-center justify-start"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-900 rounded-full flex items-center justify-center">
        <value.icon className="w-8 h-8 text-zinc-700 dark:text-zinc-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {value.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center transition-all duration-500 line-clamp-3 group-hover:line-clamp-none group-hover:mt-2">
        {value.description}
      </p>

      {/* Overlay effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        className="absolute inset-0 bg-zinc-600 rounded-2xl pointer-events-none transition-opacity duration-500"
      />
    </motion.div>
  ))}
</motion.div>

      
      </div>
    </div>
  );
};

export default AboutPage;
