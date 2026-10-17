import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, Heart, Users, Home, Award, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To make property discovery simple, transparent, and accessible for everyone.' },
  { icon: Eye, title: 'Our Vision', desc: 'To be the most trusted real estate platform connecting people with their dream homes.' },
  { icon: Heart, title: 'Our Values', desc: 'Integrity, transparency, and customer-first thinking in everything we do.' },
];

const stats = [
  { label: 'Happy Clients', value: '12K+' },
  { label: 'Properties Listed', value: '500+' },
  { label: 'Cities Covered', value: '25+' },
  { label: 'Years of Excellence', value: '10+' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-beige py-16 lg:py-24">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="section-label">ABOUT EVERLIGHT HOMES</p>
              <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl">
                Building Futures,<br />
                <span className="font-script text-gold">One Home at a Time</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-secondary">
                Everlight Homes was founded with a simple belief: finding your dream home should be an exciting journey, not a stressful one. We combine cutting-edge technology with personalized service to help you discover, buy, sell, and rent exceptional properties.
              </p>
              <p className="mt-3 text-base leading-relaxed text-secondary">
                Our team of experienced real estate professionals is dedicated to making your property journey seamless, transparent, and rewarding. Whether you&apos;re a first-time buyer, a seasoned investor, or looking to rent, we&apos;re here for you.
              </p>
              <Link href="/contact" className="btn-primary mt-6">
                Get in Touch <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-hover">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Modern luxury interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-beige">
                    <v.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige py-16 lg:py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-4xl font-bold text-navy">{s.value}</p>
                  <p className="mt-1 text-sm text-secondary">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-secondary/60">* Demo values — replace with actual business data when available.</p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
