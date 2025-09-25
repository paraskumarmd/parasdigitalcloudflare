"use client";

import { useState, useEffect } from 'react';

// Declare dataLayer for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  //{ name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Only render theme toggle after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToPage = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // ========================================
  // CUSTOM JAVASCRIPT CODE SECTION
  // ========================================
  // Add your custom JavaScript code here
  // This section is reserved for any additional functionality
  // you want to add to the header component
  // Google Tag Manager initialization
  useEffect(() => {
    // Initialize Google Tag Manager
    (function(w: any, d: any, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0];
      var j = d.createElement(s) as HTMLScriptElement;
      var dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode?.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-5P749ZQ8');
  }, []);

  // Track page views for GTM on route changes
  useEffect(() => {
    // Push page view event to dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname,
        page_referrer: document.referrer,
        user_language: navigator.language,
        user_platform: (navigator as any).userAgentData?.platform || navigator.platform,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        screen_resolution: `${screen.width}x${screen.height}`
      });
    }
  }, [pathname]);

  // ========================================

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex lg:flex-1"
        >
          <Link href="/" className="text-xl font-bold text-foreground">
            Paras Digital
          </Link>
        </motion.div>

        <div className="flex lg:hidden items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              className="relative"
            >
              {getThemeIcon()}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:flex lg:gap-x-8"
        >
          {navigation.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={cn(
                "text-sm font-medium transition-colors relative group",
                pathname === item.href 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                {item.name}
              </Link>
              <span className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4"
        >
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              className="relative"
            >
              {getThemeIcon()}
            </Button>
          )}
          <Button
            onClick={() => navigateToPage('/contact')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Let's Connect
          </Button>
        </motion.div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border/40"
          >
            <div className="space-y-1 px-4 pb-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigateToPage(item.href)}
                  className={cn(
                    "block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2">
                <Button
                  onClick={() => navigateToPage('/contact')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Let's Connect
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}