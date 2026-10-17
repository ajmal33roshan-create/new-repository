'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, Home as HomeIcon, DollarSign, BedDouble, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { PROPERTY_TYPES, LISTING_TYPES, CITIES } from '@/lib/constants';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-beige">
      <div className="container-x relative z-10 pt-12 pb-8 lg:pt-20 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left content */}
          <div className="order-2 lg:order-1">
            <p className="section-label">PREMIUM PROPERTIES. BETTER LIVING.</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-6xl">
              Find Your Dream Home
              <span className="block font-script text-4xl font-normal text-gold sm:text-5xl lg:text-6xl">
                with Everlight
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-secondary">
              Discover exceptional homes, prime locations, and lifestyle-driven communities — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/properties" className="btn-primary">
                Explore Properties <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/list-property" className="btn-outline">
                List Your Property
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-hover lg:aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
                alt="Modern luxury glass villa at dusk with pool"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Search Panel */}
        <form
          onSubmit={handleSearch}
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
        </form>
      </div>
    </section>
  );
}
