'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, Home as HomeIcon, DollarSign, BedDouble, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROPERTY_TYPES, LISTING_TYPES, CITIES } from '@/lib/constants';
import TiltCard from './TiltCard';

export default function HeroSection() {
  const router = useRouter();
  const [form, setForm] = useState({
    city: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  // Subtle parallax on the hero image as the page scrolls
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.65]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    router.push(`/properties?${params.toString()}`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
  };

  return (
    <section className="relative overflow-hidden bg-beige">
      {/* Ambient floating gold orbs for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl animate-float-slow" />
        <div className="absolute right-10 top-40 h-48 w-48 rounded-full bg-navy/5 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-gold/5 blur-3xl animate-float-slow" />
      </div>

      {/* Subtle decorative grid lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(#142B49 1px, transparent 1px), linear-gradient(90deg, #142B49 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div className="container-x relative z-10 pt-12 pb-8 lg:pt-20 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left content — staggered cinematic entrance */}
          <div className="order-2 lg:order-1">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Properties. Better Living.
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-6xl"
            >
              Find Your Dream Home
              <span className="mt-1 block font-script text-4xl font-normal text-gold sm:text-5xl lg:text-6xl">
                with Everlight
              </span>
            </motion.h1>

            {/* Gold accent line */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-gold to-gold/0"
            />

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-5 max-w-md text-base leading-relaxed text-secondary"
            >
              Discover exceptional homes, prime locations, and lifestyle-driven communities — all in one place.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link href="/properties" className="btn-primary group">
                Explore Properties
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/list-property" className="btn-outline">
                List Your Property
              </Link>
            </motion.div>
          </div>

          {/* Right image — 3D tilt + parallax + cinematic overlay */}
          <div className="order-1 lg:order-2">
            <TiltCard max={6} scale={1.01} className="group">
              <div
                ref={imgRef}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-hover lg:aspect-[5/4]"
              >
                <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
                  <Image
                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern luxury glass villa at dusk with pool"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
                {/* Cinematic gradient overlay */}
                <motion.div
                  style={{ opacity: overlayOpacity }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/10 to-transparent"
                />
                {/* Floating glass info badge */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-4 left-4 rounded-2xl glass-panel px-4 py-3 shadow-lg"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold">Featured Estate</p>
                  <p className="text-sm font-bold text-navy">Signature Collection</p>
                </motion.div>
                {/* Shimmer sweep on hover */}
                <div className="shimmer-sweep pointer-events-none absolute inset-0" />
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Search Panel */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 rounded-2xl bg-white p-4 shadow-card-hover sm:p-6"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input-field pl-9 appearance-none cursor-pointer"
              >
                <option value="">Location</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <select
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                className="input-field pl-9 appearance-none cursor-pointer"
              >
                <option value="">Property Type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <select
                value={form.listingType}
                onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                className="input-field pl-9 appearance-none cursor-pointer"
              >
                <option value="">Purpose</option>
                {LISTING_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <input
              type="number"
              placeholder="Min Price"
              value={form.minPrice}
              onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={form.maxPrice}
              onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
              className="input-field"
            />
            <div className="relative">
              <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <select
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="input-field pl-9 appearance-none cursor-pointer"
              >
                <option value="">Bedrooms</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>{n}+</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-gold mt-3 w-full sm:w-auto sm:px-8">
            <Search className="h-4 w-4" /> Search Properties
          </button>
        </motion.form>
      </div>
    </section>
  );
}
