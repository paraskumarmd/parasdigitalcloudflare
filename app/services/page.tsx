import { ServicesSection } from '@/components/sections/services-section';

export const metadata = {
  title: 'Services - Paras Digital | AI Strategy & Digital Marketing Solutions',
  description: 'Comprehensive AI and digital marketing services including strategy implementation, analytics, automation, and personalization solutions.',
  keywords: ['AI strategy', 'digital marketing services', 'marketing automation', 'analytics', 'personalization'],
};

export default function ServicesPage() {
  return (
    <main className="pt-20">
      <ServicesSection />
    </main>
  );
}