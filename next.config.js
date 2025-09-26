/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Cloudflare Pages with Functions - hybrid rendering
  output: 'standalone',
  images: { 
    domains: [
      'prod-files-secure.s3.us-west-2.amazonaws.com', 
      's3.us-west-2.amazonaws.com',
      'notion.so',
      'www.notion.so',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable hybrid rendering for Cloudflare Pages with Functions
  // Pages are statically generated when possible, API routes handled by Cloudflare Functions
  
  // Performance optimizations for hybrid rendering
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Reduce bundle size
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Split vendor chunks to reduce individual file sizes
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 20000000, // 20MB chunks (well under 25MB limit)
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          // Split large packages into separate chunks
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide',
            priority: 20,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  // Enable compression
  compress: true,

  // ✅ Redirects for SEO & domain handling
  async redirects() {
    return [
      {
        source: '/www/:path*',
        destination: '/:path*',
        permanent: true, // redirect www -> root domain
      },
    ];
  },
};

module.exports = nextConfig;
