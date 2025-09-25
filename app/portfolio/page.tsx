import { PortfolioSection } from '@/components/sections/portfolio-section';

export const metadata = {
  title: 'Portfolio - Paras Digital | AI & Digital Marketing Projects',
  description: 'Explore featured AI and digital marketing projects showcasing real-world applications and measurable business results.',
  keywords: ['AI projects', 'digital marketing portfolio', 'case studies', 'machine learning applications', 'marketing campaigns'],
};

export default function PortfolioPage() {
  return (
    <main className="pt-20">
      <PortfolioSection />
    </main>
  );
}