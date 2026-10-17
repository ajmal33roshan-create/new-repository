'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Bed, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn, formatPrice } from '@/lib/utils';

const listingBadge: Record<string, { label: string; class: string }> = {
  SALE: { label: 'For Sale', class: 'bg-navy text-white' },
  RENT: { label: 'For Rent', class: 'bg-gold text-navy' },
  COMMERCIAL: { label: 'Commercial', class: 'bg-navy-light text-white' },
};

export interface PropertyCardData {
  id: string;
  title: string;
  price: number;
  currency: string;
  listingType: string;
  propertyType: string;
  city: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  mainImage: string;
  featured: boolean;
}

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const badge = listingBadge[property.listingType] || listingBadge.SALE;

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push('/auth/login');
      return;
    }
    setLoading(true);
    const newFav = !fav;
    setFav(newFav);
    try {
      await fetch('/api/favorites', {
        method: newFav ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
    } catch {
      setFav(!newFav);
    }
    setLoading(false);
  };

  return (
    <Link href={`/properties/${property.id}`} className="card group block overflow-hidden hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.mainImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
        />
        <span className={cn('absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold', badge.class)}>
          {badge.label}
        </span>
        <button
          onClick={toggleFav}
          disabled={loading}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110"
          aria-label="Add to favorites"
        >
          <Heart className={cn('h-4 w-4 transition-colors', fav ? 'fill-red-500 text-red-500' : 'text-navy')} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-navy transition-colors group-hover:text-gold">
          {property.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-secondary">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
          <span className="line-clamp-1">{property.city} · {property.address}</span>
        </p>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 text-xs text-secondary">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-gold" /> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-gold" /> {property.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5 text-gold" /> {property.area.toLocaleString()} sqft
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-3">
          <div>
            <span className="text-lg font-bold text-navy">
              {formatPrice(property.price, property.currency)}
            </span>
            {property.listingType === 'RENT' && (
              <span className="text-xs text-secondary">/mo</span>
            )}
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-beige text-navy transition-all group-hover:bg-navy group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
