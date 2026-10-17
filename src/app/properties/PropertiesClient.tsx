'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, SlidersHorizontal, Grid, List, MapPin, Bed, Bath, Maximize,
  ArrowRight, X, ChevronLeft, ChevronRight, Heart,
} from 'lucide-react';
import PropertyCard, { type PropertyCardData } from '@/components/PropertyCard';
import {
  PROPERTY_TYPES, LISTING_TYPES, CITIES, AMENITIES, FURNISHED_OPTIONS, SORT_OPTIONS,
} from '@/lib/constants';
import { cn, formatPrice, formatPriceFull } from '@/lib/utils';

interface ParsedProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listingType: string;
  propertyType: string;
  city: string;
  neighborhood: string | null;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  areaUnit: string;
  furnished: string | null;
  amenities: string[];
  images: string[];
  mainImage: string;
  featured: boolean;
  createdAt: string;
}

export default function PropertiesClient({
  properties,
  total,
  page,
  pageSize,
  searchParams,
}: {
  properties: ParsedProperty[];
  total: number;
  page: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState(searchParams.q || '');

  const updateFilter = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    router.push(`/properties?${newParams.toString()}`);
  }, [params, router]);

  const toggleAmenity = useCallback((amenity: string) => {
    const current = (searchParams.amenities || '').split(',').filter(Boolean);
    const newList = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    updateFilter('amenities', newList.join(','));
  }, [searchParams.amenities, updateFilter]);

  const clearFilters = () => {
    router.push('/properties');
    setSearchText('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('q', searchText);
  };

  const totalPages = Math.ceil(total / pageSize);
  const selectedAmenities = (searchParams.amenities || '').split(',').filter(Boolean);
  const hasFilters = Object.keys(searchParams).some((k) => k !== 'page' && searchParams[k]);

  const listingBadge: Record<string, { label: string; class: string }> = {
    SALE: { label: 'For Sale', class: 'bg-navy text-white' },
    RENT: { label: 'For Rent', class: 'bg-gold text-navy' },
    COMMERCIAL: { label: 'Commercial', class: 'bg-navy-light text-white' },
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
        <input
          type="text"
          placeholder="Search by city, address..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input-field pl-9"
        />
      </form>

      {/* Listing Type */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-navy">Listing Purpose</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('listingType', '')}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              !searchParams.listingType ? 'bg-navy text-white' : 'bg-beige text-navy hover:bg-navy/10'
            )}
          >
            All
          </button>
          {LISTING_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => updateFilter('listingType', t.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                searchParams.listingType === t.value ? 'bg-navy text-white' : 'bg-beige text-navy hover:bg-navy/10'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-navy">Property Type</h4>
        <select
          value={searchParams.propertyType || ''}
          onChange={(e) => updateFilter('propertyType', e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-navy">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.minPrice || ''}
            onBlur={(e) => updateFilter('minPrice', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.maxPrice || ''}
            onBlur={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-navy">Beds</h4>
          <select
            value={searchParams.bedrooms || ''}
            onChange={(e) => updateFilter('bedrooms', e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>{n}+</option>
            ))}
          </select>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-navy">Baths</h4>
          <select
            value={searchParams.bathrooms || ''}
            onChange={(e) => updateFilter('bathrooms', e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>{n}+</option>
            ))}
          </select>
        </div>
      </div>

      {/* Area Range */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-navy">Area (sqft)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.minArea || ''}
            onBlur={(e) => updateFilter('minArea', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.maxArea || ''}
            onBlur={(e) => updateFilter('maxArea', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Furnished */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-navy">Furnished Status</h4>
        <select
          value={searchParams.furnished || ''}
          onChange={(e) => updateFilter('furnished', e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="">Any</option>
          {FURNISHED_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-navy">Amenities</h4>
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="h-4 w-4 rounded border-navy/20 text-gold focus:ring-gold/20"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="btn-ghost w-full text-secondary hover:text-red-500">
          <X className="h-4 w-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white py-8 lg:py-12">
      <div className="container-x">
        {/* Page header */}
        <div className="mb-8">
          <p className="section-label">ALL PROPERTIES</p>
          <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Find Your Perfect Property</h1>
          <p className="mt-2 text-secondary">
            {total} {total === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gold" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy">Filters</h3>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-navy/5 bg-beige/50 p-3">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>

              <div className="hidden text-sm text-secondary lg:block">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={searchParams.sort || 'newest'}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="input-field w-auto cursor-pointer py-2 text-sm"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <div className="hidden gap-1 sm:flex">
                  <button
                    onClick={() => setView('grid')}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                      view === 'grid' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-navy/10'
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                      view === 'list' ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-navy/10'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties */}
            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-beige/30 py-20 text-center">
                <Search className="h-12 w-12 text-navy/20" strokeWidth={1} />
                <h3 className="mt-4 text-lg font-semibold text-navy">No properties found</h3>
                <p className="mt-2 max-w-sm text-sm text-secondary">
                  Try adjusting your search filters or exploring different areas.
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} className="btn-primary mt-4">
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={{
                      id: p.id, title: p.title, price: p.price, currency: p.currency,
                      listingType: p.listingType, propertyType: p.propertyType, city: p.city,
                      address: p.address, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
                      area: p.area, mainImage: p.mainImage, featured: p.featured,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((p) => {
                  const badge = listingBadge[p.listingType] || listingBadge.SALE;
                  return (
                    <Link key={p.id} href={`/properties/${p.id}`} className="card group flex flex-col overflow-hidden hover:shadow-card-hover sm:flex-row">
                      <div className="relative aspect-[4/3] sm:aspect-auto sm:w-72 sm:shrink-0">
                        <Image src={p.mainImage} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="288px" />
                        <span className={cn('absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold', badge.class)}>{badge.label}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-base font-semibold text-navy transition-colors group-hover:text-gold">{p.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-secondary">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" /> {p.city} · {p.address}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-secondary">{p.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-secondary">
                          {p.bedrooms !== null && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5 text-gold" /> {p.bedrooms} Beds</span>}
                          {p.bathrooms !== null && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5 text-gold" /> {p.bathrooms} Baths</span>}
                          <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5 text-gold" /> {p.area.toLocaleString()} sqft</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <span className="text-lg font-bold text-navy">
                            {formatPriceFull(p.price, p.currency)}
                            {p.listingType === 'RENT' && <span className="text-xs text-secondary">/mo</span>}
                          </span>
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-beige text-navy transition-all group-hover:bg-navy group-hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => updateFilter('page', page > 1 ? String(page - 1) : '')}
                  disabled={page <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy/10 text-navy transition-colors hover:bg-beige disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => updateFilter('page', p > 1 ? String(p) : '')}
                        className={cn(
                          'flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors',
                          p === page ? 'bg-navy text-white' : 'border border-navy/10 text-navy hover:bg-beige'
                        )}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="px-1 text-secondary">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => updateFilter('page', String(page + 1))}
                  disabled={page >= totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy/10 text-navy transition-colors hover:bg-beige disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-navy">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-beige">
                <X className="h-4 w-4 text-navy" />
              </button>
            </div>
            <FilterContent />
            <button onClick={() => setShowFilters(false)} className="btn-primary mt-4 w-full">
              Show {total} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
