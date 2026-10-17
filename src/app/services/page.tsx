import Link from 'next/link';
import { Home, KeyRound, TrendingUp, Building, Search, ClipboardCheck, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';

const services = [
  { icon: Home, title: 'Buy a Property', desc: 'Browse verified listings and find your dream home with expert guidance at every step.' },
  { icon: KeyRound, title: 'Rent a Property', desc: 'Discover quality rental properties that fit your lifestyle and budget.' },
  { icon: TrendingUp, title: 'Sell Your Property', desc: 'List your property and reach thousands of potential buyers with our marketing tools.' },
  { icon: Building, title: 'Property Management', desc: 'Comprehensive management services for property owners and investors.' },
  { icon: Search, title: 'Property Valuation', desc: 'Get an accurate market valuation of your property from our experienced team.' },
  { icon: ClipboardCheck, title: 'Legal Consultation', desc: 'Professional guidance through the legal aspects of buying, selling, and renting.' },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-beige py-16 lg:py-24">
        <div className="container-x text-center">
          <p className="section-label">OUR SERVICES</p>
          <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl">
            Comprehensive Real Estate<br />
            <span className="font-script text-gold">Solutions for You</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-secondary">
            From buying your first home to managing investment properties, we offer a full range of real estate services tailored to your needs.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.1}>
                <div className="group h-full rounded-2xl border border-navy/5 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-beige transition-colors group-hover:bg-gold/10">
                    <s.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{s.desc}</p>
                  <Link href="/contact" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold hover:gap-2 transition-all">
                    Learn More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
