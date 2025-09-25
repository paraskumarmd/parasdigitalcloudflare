import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Paras Digital - AI Enthusiast & Digital Marketing Strategist',
  description: 'Professional AI consultant and digital marketing strategist helping businesses leverage artificial intelligence for growth and optimization.',
  keywords: ['AI consultant', 'digital marketing', 'machine learning', 'SEO', 'marketing automation', 'AI strategy'],
  authors: [{ name: 'Paras Digital' }],
  creator: 'Paras Digital',
  metadataBase: new URL('https://parasdigtital.vercel.app'), // Your Vercel domain
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://parasdigtital.vercel.app',
    title: 'Paras Digital - AI Enthusiast & Digital Marketing Strategist',
    description: 'Professional AI consultant and digital marketing strategist helping businesses leverage artificial intelligence for growth and optimization.',
    siteName: 'Paras Digital Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Paras Digital - AI & Digital Marketing Expert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paras Digital - AI Enthusiast & Digital Marketing Strategist',
    description: 'Professional AI consultant and digital marketing strategist helping businesses leverage artificial intelligence for growth and optimization.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://parasdigtital.vercel.app" />
      </head>
      <body className={cn(
        inter.variable,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5P749ZQ8"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Header />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}