'use client';

import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiClock, FiHeart } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageProvider';
import style from "./FeaturesSection.module.css"



const FeaturesSection = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: FiShield,
      title: language === 'ar' ? 'مواد فاخرة' : 'Premium Materials',
      description: language === 'ar' 
        ? 'أرقى أنواع الكشمير والحرير والصوف من مصادر عالمية موثوقة' 
        : 'The finest cashmere, silk, and wool sourced from trusted global origins'
    },
    {
      icon: FiHeart,
      title: language === 'ar' ? 'صناعة يدوية' : 'Artisan Craftsmanship',
      description: language === 'ar' 
        ? 'كل قطعة مصنوعة يدوياً بعناية فائقة من حرفيين مهرة' 
        : 'Each piece is meticulously handcrafted by skilled artisans'
    },
    {
      icon: FiTruck,
      title: language === 'ar' ? 'شحن عالمي' : 'Worldwide Delivery',
      description: language === 'ar' 
        ? 'توصيل مجاني لجميع الطلبات مع تغليف فاخر مميز' 
        : 'Complimentary shipping on all orders with luxury gift packaging'
    },
    {
      icon: FiClock,
      title: language === 'ar' ? 'خدمة شخصية' : 'Concierge Service',
      description: language === 'ar' 
        ? 'فريق متخصص لمساعدتك في اختيار القطعة المثالية' 
        : 'A dedicated team to help you select the perfect piece'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
 <section
   
      className={style.features}
 style={{
    backgroundImage: `url("https://res.cloudinary.com/dfq1xxerr/image/upload/v1773467777/features.png")`,
  }}  
 >

  
  
      {/* Background Image */}
      <div className={style.lear}>
      
       
      

      <div className="max-w-7xl mx-auto  z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 p-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {language === 'ar' ? 'لماذا تاج سكارف؟' : 'Why Taj Scarf?'}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'نلتزم بتقديم أرقى تجربة تسوق لعملائنا المميزين' 
              : 'We are devoted to delivering the finest experience for our distinguished clientele'
            }
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-white transition-colors duration-300 group-hover:text-black" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-white/80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
