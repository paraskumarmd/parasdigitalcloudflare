"use client";

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Brain, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Digital Marketing: Trends for 2024",
    excerpt: "Exploring how artificial intelligence is reshaping digital marketing strategies and what businesses need to know to stay competitive.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "AI Trends",
    image: "https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Brain,
    slug: "ai-digital-marketing-trends-2024"
  },
  {
    id: 2,
    title: "Building High-Converting Landing Pages with AI Optimization",
    excerpt: "A comprehensive guide to using machine learning algorithms to optimize landing page performance and increase conversion rates.",
    date: "2024-01-08",
    readTime: "12 min read",
    category: "Conversion Optimization",
    image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: TrendingUp,
    slug: "ai-landing-page-optimization"
  },
  {
    id: 3,
    title: "Marketing Automation: From Basic Workflows to AI-Powered Journeys",
    excerpt: "Transform your marketing automation from simple email sequences to intelligent, AI-driven customer journey orchestration.",
    date: "2024-01-01",
    readTime: "10 min read",
    category: "Automation",
    image: "https://images.pexels.com/photos/8849407/pexels-photo-8849407.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Zap,
    slug: "ai-powered-marketing-automation"
  }
];

export function BlogSection() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Latest Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts on AI, digital marketing, and the future of technology-driven business growth
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => {
            const Icon = post.icon;
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link href={`/blog/${post.slug}`} className="block group" passHref>
                  <Card className="hover:shadow-xl transition-all duration-500 group border-border/50 hover:border-primary/20 cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Icon */}
                    <div className="absolute top-4 right-4 p-2 bg-primary/10 backdrop-blur-sm rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>

                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-medium text-primary hover:text-primary/80 group/btn"
                      asChild
                    >
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
            <CardContent className="p-0 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Stay Updated with AI & Marketing Insights
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get weekly insights on the latest AI trends, marketing strategies, and practical tips 
                to grow your business. No spam, just valuable content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Join 2,000+ professionals already subscribed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* View all posts CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="rounded-full px-8">
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}