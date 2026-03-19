'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import style from './Navbar.module.css';
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon,
  FiGlobe,
  FiLogIn,
  FiUserPlus,
  FiHeart,
  FiPackage,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiArrowUp
} from 'react-icons/fi';
import { useAppSelector } from '../hooks/redux';
import { useTheme } from '../contexts/ThemeProvider';
import { useLanguage } from '../contexts/LanguageProvider';
import { useWishlist } from '../contexts/WishlistProvider';
import { SafeSignedIn, SafeSignedOut, SafeUserButton, SafeSignInButton, SafeSignUpButton } from '@/hooks/useClerkSafe';
import { useSafeUser } from '@/hooks/useClerkUser';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const { wishlist } = useWishlist();
  const { user } = useSafeUser();
  const cartItems = useAppSelector((state) => state.cart.items || []);
  const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { href: '/', text: language === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/about', text: language === 'ar' ? 'من نحن' : 'About' },
    { href: '/blog', text: language === 'ar' ? 'المدونة' : 'Blog' },

    { href: '/contact', text: language === 'ar' ? 'اتصل بنا' : 'Contact' },
    { href: '/categories', text: language === 'ar' ? ' الفئات' : 'Categories' },
  ];

  const authItems = [
    { href: '/sign-in', icon: FiLogIn, text: language === 'ar' ? 'تسجيل الدخول' : 'Login' },
    { href: '/sign-up', icon: FiUserPlus, text: language === 'ar' ? 'إنشاء حساب' : 'Sign Up' },
  ];

  const renderCartLink = () => (
    <Link
      href="/cart"
      className="relative p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200"
    >
      <FiShoppingCart className="w-5 h-5" />
      {isMounted && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
  ];

  return (
    <>
      {/* Enhanced Top Discount Bar - Silver Gray */}
      <div className={`hidden md:flex justify-between items-center bg-gradient-to-r from-gray-900 via-gray-100 to-gray-900 text-white px-4 sm:px-6 lg:px-8 transition-all duration-300 shadow-lg ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-12 py-2.5 opacity-100'}`}>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="inline-flex px-2 py-1 text-xs font-bold bg-white/20 rounded-full">30% OFF</span>
          <p className="text-xs font-medium">
            {language === 'ar' ? 'خصم 30% على كل المنتجات! عرض محدود' : '30% OFF Everything! Limited Time Only'}
          </p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link href="/categories" className="text-xs font-bold px-3 py-1 bg-white/20 rounded-md transition-all hover:bg-white/30">
            {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
          </Link>
        
          {socialLinks.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              aria-label={link.label}
              className="group hover:text-white/80 transition-colors p-4 -m-1 rounded-full"
            >
            </Link>
          ))}
        </div>
      </div>

      <nav className= "bg-gray-300 dark:bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-2xl font-serif font-black tracking-tight text-gray-900 dark:text-white">
                  {language === 'ar' ? 'تاج سكارف' : 'Taj Scarf'}
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${style.navLink} flex items-center space-x-1 rtl:space-x-reverse text-gray-700 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white font-sans font-medium transition-colors duration-200`}
                >
                  <span>{item.text}</span>
                </Link>
              ))}
              {authItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${style.navLink} flex items-center space-x-1 rtl:space-x-reverse text-gray-700 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white font-sans font-medium transition-colors duration-200`}
                >
                  <span>{item.text}</span>
                </Link>
              ))  }
              <SafeSignedIn>
                <Link
                  href="/orders"
                  className={`${style.navLink} flex items-center space-x-1 rtl:space-x-reverse text-gray-700 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white font-sans font-medium transition-colors duration-200`}
                >
                  <span>{language === 'ar' ? 'طلباتي' : 'My Orders'}</span>
                </Link>
              </SafeSignedIn>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex space-x-4 rtl:space-x-reverse items-center">
              {/* Language */}
              <button onClick={toggleLanguage} title={language === 'ar' ? 'تغيير اللغة' : 'Toggle Language'} className="p-2 rounded-lg  text-gray-700 dark:text-gray-300  hover:scale-125 transition-transform duration-300">
                <FiGlobe className="w-5 h-5" />
              </button>
              {/* Theme */}
              <button onClick={toggleTheme} title={theme === 'light' ? (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode') : (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')} className="p-2 rounded-lg  text-gray-700 dark:text-gray-300 hover:scale-125 transition-transform duration-300">
                {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </button>
              <Link href="/wishlist" className="relative p-2 rounded-full text-pink-700 ">
                <FiHeart className="w-5 h-5" />
                {isMounted && wishlist.length > 0 && <span className="absolute -top-1 -right-1  text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlist.length}</span>}
              </Link>
              {/* Cart */}
              {renderCartLink()}
              
              {/* Auth */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <SafeSignedIn>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  {language === 'ar' ? `مرحباً، ${user?.firstName}` : `Hi, ${user?.firstName}`}
                  </div>
                  <SafeUserButton afterSignOutUrl="/" />
                </SafeSignedIn>
                <SafeSignedOut>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <SafeSignInButton mode="modal">
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                      </button>
                    </SafeSignInButton>
                    <SafeSignUpButton mode="modal">
                      <button className="px-4 py-2 text-sm font-medium bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-all duration-200 shadow-sm border border-zinc-700">
                        {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                      </button>
                    </SafeSignUpButton>
                  </div>
                </SafeSignedOut>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={toggleLanguage} title={language === 'ar' ? 'تغيير اللغة' : 'Toggle Language'} className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:scale-125 transition-transform duration-300">
                <FiGlobe className="w-5 h-5" />
              </button>
              <button onClick={toggleTheme} title={theme === 'light' ? (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode') : (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')} className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:scale-125 transition-transform duration-300">
                {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </button>
              <Link href="/wishlist" className="relative p-2 rounded-lg text-pink-700 ">
                <FiHeart className="w-5 h-5" />
                {isMounted && wishlist.length > 0 && <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlist.length}</span>}
              </Link>
              {renderCartLink()}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg  text-gray-700 ">
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="py-4 space-y-2">
                {navItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 dark:text-gray-300 hover:scale-125 transition-transform duration-300">
                    <span>{item.text}</span>
                  </Link>
                ))}
                
                <SafeSignedIn>
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 dark:text-gray-300 hover:scale-125 transition-transform duration-300">
                    <FiPackage className="w-4 h-4" />
                    <span>{language === 'ar' ? 'طلباتي' : 'My Orders'}</span>
                  </Link>
                </SafeSignedIn>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <SafeSignedIn>
                    <div className="px-4 py-2 flex items-center space-x-4 rtl:space-x-reverse">
                      <SafeUserButton afterSignOutUrl="/" />
                      <div className="text-sm text-gray-700 dark:text-gray-300 text-left">
                        {language === 'ar' ? `مرحباً، ${user?.firstName}` : `Hi, ${user?.firstName}`}
                      </div>
                    </div>
                  </SafeSignedIn>
                  
                  <SafeSignedOut>
                    <div className="flex flex-col space-y-2 px-4 py-2">
                      <SafeSignInButton mode="modal">
                        <button onClick={() => setIsMenuOpen(false)} className="w-full text-left rtl:text-right py-2 text-gray-700 dark:text-gray-300 font-medium">
                          {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                        </button>
                      </SafeSignInButton>
                      <SafeSignUpButton mode="modal">
                        <button onClick={() => setIsMenuOpen(false)} className="w-full py-3 bg-zinc-800 text-white rounded-lg font-bold shadow-md">
                          {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                        </button>
                      </SafeSignUpButton>
                    </div>
                  </SafeSignedOut>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Floating Social Media on scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 8 }}
            exit={{ opacity: 0, y: 9 }}
            transition={{ duration: 0.9 }}
                    aria-label="Scroll to top"

  className="fixed bottom-1 left-3 z-50 "   >
            {socialLinks.map((link, idx) => (
              <Link
    href={link.href}
    key={idx}
    aria-label={link.label}
    className="group hover:text-white/80 transition-colors  -m-1 rounded-full"
  >
    <link.icon className="w-6 h-6 mt-5  transition-transform duration-300 group-hover:scale-125 text-black dark:text-white  " />
  </Link>
            ))}
            
        
          </motion.div>
          
        )}
      </AnimatePresence>
       <AnimatePresence>
    {isScrolled && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-1 right-2 z-50"
      >
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
  className="group hover:text-white/80 transition-colors  -m-1 rounded-full"      >
          <FiArrowUp className="w-6 h-6 mt-2  transition-transform duration-300 group-hover:scale-125 text-black dark:text-white  " />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
    </>
  );
};

export default Navbar;