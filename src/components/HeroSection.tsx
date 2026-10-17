'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, Home as HomeIcon, DollarSign, BedDouble, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROPERTY_TYPES, LISTING_TYPES, CITIES } from '@/lib/constants';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1781795414968-8ece31826420?auto=format&fit=crop&w=1920&q=80';

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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

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
    <section ref={sectionRef} className="relative overflow-hidden bg-navy">
      {/* Full-bleed cinematic background image */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-[-10%]">
        <Image
          src={HERO_IMAGE}
          alt="Ultra-luxury contemporary glass mansion with infinity pool at golden hour"
          fill
          priority
          className="object-cover object-center lg:object-[70%_center]"
          sizes="100vw"
        />
      </motion.div>

      {/* Cinematic gradient overlay — dark on left for text, fading to transparent on right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />
      {/* Bottom fade for search panel separation */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy/80 to-transparent" />

      <div className="container-x relative z-10 pt-12 pb-8 lg:pt-24 lg:pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left content — staggered cinematic entrance */}
          <div className="order-2 lg:order-1">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Properties. Better Living.
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-4 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
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
              className="mt-5 max-w-md text-base leading-relaxed text-white/80 drop-shadow"
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
              <Link href="/properties" className="btn-gold group">
                Explore Properties
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10 active:scale-95"
              >
                List Your Property
              </Link>
            </motion.div>
          </div>

          {/* Right side — floating glass badge over the image */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="lg:absolute lg:bottom-12 lg:right-8"
            >
              <div className="rounded-2xl glass-panel px-5 py-4 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold">Featured Estate</p>
                <p className="text-sm font-bold text-navy">Signature Collection</p>
              </div>
            </motion.div>
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
