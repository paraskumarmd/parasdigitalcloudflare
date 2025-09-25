"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Brain, BarChart3, Zap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: 1,
    title: "AI-Powered Customer Segmentation Platform",
    category: "AI Development",
    description: "Developed a machine learning platform that increased client's email campaign ROI by 340% through advanced customer segmentation and predictive analytics.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Python", "TensorFlow", "React", "AWS"],
    results: ["340% ROI increase", "85% accuracy", "50% faster segmentation"],
    icon: Brain,
    link: "#",
    github: "#"
  },
  {
    id: 2,
    title: "Multi-Channel Attribution Dashboard",
    category: "Analytics",
    description: "Built a comprehensive analytics dashboard that tracks customer journeys across all touchpoints, providing actionable insights for campaign optimization.",
    image: "https://images.pexels.com/photos/7947758/pexels-photo-7947758.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["React", "PostgreSQL", "Python", "D3.js"],
    results: ["30% better attribution", "Real-time insights", "15+ channels tracked"],
    icon: BarChart3,
    link: "#",
    github: "#"
  },
  {
    id: 3,
    title: "Automated Lead Scoring System",
    category: "Automation",
    description: "Implemented an intelligent lead scoring system using ML algorithms that improved sales team efficiency by 60% and increased conversion rates by 45%.",
    image: "https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Scikit-learn", "FastAPI", "PostgreSQL", "Docker"],
    results: ["60% efficiency gain", "45% higher conversion", "Automated workflow"],
    icon: Zap,
    link: "#",
    github: "#"
  },
  {
    id: 4,
    title: "Personalized Content Recommendation Engine",
    category: "Personalization",
    description: "Created a sophisticated recommendation engine that personalizes content for each user, resulting in 80% higher engagement and 25% increased session duration.",
    image: "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Node.js", "MongoDB", "Redis", "Vue.js"],
    results: ["80% engagement boost", "25% longer sessions", "Real-time personalization"],
    icon: Users,
    link: "#",
    github: "#"
  }
];

const categories = ["All", "AI Development", "Analytics", "Automation", "Personalization"];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

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
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world applications of AI and digital marketing that drive measurable business results
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="rounded-full transition-all duration-300"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-border/50 hover:border-primary/20">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Project links overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-4"
                      >
                        <Button size="sm" variant="secondary" className="rounded-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full bg-white/10 backdrop-blur-sm">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                      </motion.div>

                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          {project.category}
                        </Badge>
                      </div>

                      {/* Icon */}
                      <div className="absolute top-4 right-4 p-2 bg-primary/10 backdrop-blur-sm rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Results */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                        {project.results.map((result) => (
                          <div key={result} className="text-xs text-center p-2 bg-muted/50 rounded-lg">
                            <div className="font-medium text-foreground">{result}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Interested in seeing more projects or collaborating?
          </p>
          <Button size="lg" className="rounded-full px-8">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  );
}