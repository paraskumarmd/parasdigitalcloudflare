"use client";

import { motion } from 'framer-motion';
import { Brain, BarChart3, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Brain,
    title: "Account Audit and Strategy",
    description: "Gap analysis of existing ad accounts and digital marketing strategies based on past performance while identifying new growth opportunities.",
    features: [
      "Account Audit and Assessment",
      "Optimisations and improvements",
      "Strategy and Implementation Roadmap",
      "Competitor Analysis"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: BarChart3,
    title: "Digital Marketing Analytics",
    description: "Leverage advanced analytics to understand your audience and optimize campaign performance.",
    features: [
      "Ad platform and website tracking setup audit",
      "Enhanced conversion setup",
      "Server side tracking setup",
      "Real-time Dashboards"

    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Marketing Automation",
    description: "Streamline your marketing processes with intelligent automation that scales with your business.",
    features: [
      "Lead capture and nurture automation",
      "Lead Scoring Systems",
      "Remarketing strategy",
      "Cross-channel Orchestration"

    ],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "Personalization & CX",
    description: "Create personalized experiences that engage customers and drive conversions at every touchpoint.",
    features: [
      "Dynamic Content Optimization",
      "Custom tool development for process optimization",
      "A/B Testing Framework",
      "SEO & Generative Engine Optimization (GEO)"
    ],
    color: "from-green-500 to-teal-500"
  }
];

const process = [
  { step: "01", title: "Discovery & Analysis", description: "Understanding your business goals and current challenges" },
  { step: "02", title: "Strategy Development", description: "Creating a customized AI-driven marketing strategy" },
  { step: "03", title: "Implementation", description: "Deploying solutions with minimal disruption to operations" },
  { step: "04", title: "Optimization", description: "Continuous monitoring and improvement for maximum ROI" }
];

export function ServicesSection() {
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
            Services & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI and digital marketing solutions to accelerate your business growth
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-primary/20">
                  <CardHeader className="pb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + featureIndex * 0.05, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            My Process
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that ensures successful AI implementation and marketing optimization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-8" />
                )}
              </div>
              <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}