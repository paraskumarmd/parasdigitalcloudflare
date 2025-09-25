"use client";

import { motion } from 'framer-motion';
import { Brain, Target, Zap, Users, Award, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const skills = [
  { id: 1, name: 'Google Ads (Paid Search)', label: 'Paid Search', level: 95, icon: Brain },
  { id: 2, name: 'Digital Strategy & Planning', label: 'Digital Strategy', level: 98, icon: Target },
  { id: 3, name: 'Marketing Automation (HubSpot / Mailchimp)', label: 'Marketing Automation', level: 92, icon: Zap },
  { id: 4, name: 'Team Leadership & Client Management', label: 'Team Leadership', level: 88, icon: Users },
  { id: 5, name: 'Data Analytics (GA4 / GTM / Looker)', label: 'Data Analytics', level: 94, icon: Award },
  { id: 6, name: 'AI & Experimentation', label: 'AI / Innovation', level: 96, icon: Lightbulb },
];

const values = [
  {
    title: "Innovation-Driven",
    description: "I experiment with new tools and approaches, from AI audience models to automation workflows, to keep campaigns ahead of the curve",
  },
  {
    title: "Results-Focused",
    description: "Every project is measured against clear business outcomes — revenue growth, lead generation, and ROI.",
  },
  {
    title: "Human-Centered",
    description: "Even with automation and AI, I prioritise customer experience, ensuring campaigns build trust and lasting relationships",
  },
];

export function AboutSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate about the intersection of artificial intelligence and marketing excellence
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Personal story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Profile Picture Section */}
            <div className="relative mb-8">
              <div className="w-40 h-40 rounded-full mx-auto lg:mx-0 relative overflow-hidden shadow-lg border-4 border-primary/20">
                <Image 
                  src="/paras-profile-pic.png" 
                  alt="Profile Picture" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 160px"
                  priority
                />
              </div>
              {/* Optional: Add a subtle border or decoration */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-md">
                <Award className="w-4 h-4 text-background" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground">
              Bridging AI and Marketing Excellence
            </h3>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a Digital Marketing Specialist with 10+ years of experience helping brands grow through data-driven strategies and, more recently, AI-powered tools. My career has spanned agencies, SaaS, and eCommerce, where I've consistently delivered measurable results — from driving 60% YoY revenue growth to achieving a 107% increase in MQLs in just one quarter.
              </p>
              <p>
                Over the last few years, I've expanded my expertise into AI applications in marketing — using predictive analytics, automation, and customer segmentation to unlock smarter campaigns and more personalised customer journeys. My approach combines the creativity of marketing with the precision of data, ensuring that strategies don't just look good but deliver results.
              </p>
              <p>
                Today, I help businesses of all sizes harness the power of AI to optimize their marketing 
                efforts, from automated campaign optimization to personalized customer experiences that 
                drive engagement and conversions.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4 pt-6">
              <h4 className="text-lg font-semibold text-foreground">Core Values</h4>
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{value.title}</div>
                    <div className="text-sm text-muted-foreground">{value.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">Skills & Expertise</h3>
            
            <div className="grid gap-4">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{skill.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 pt-6"
            >
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary mb-1">100+</div>
                  <div className="text-sm text-muted-foreground">Campaigns Optimized</div>
                </CardContent>
              </Card>
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary mb-1">$2M+</div>
                  <div className="text-sm text-muted-foreground">Revenue Generated</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}