'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Heart, Share2, MapPin, Bed, Bath, Maximize, Home as HomeIcon, Check,
  Phone, Mail, Calendar, Send, ChevronRight, Sofa, Clock,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import PropertyCard, { type PropertyCardData } from '@/components/PropertyCard';
import { cn, formatPriceFull, formatDate } from '@/lib/utils';
import { PROPERTY_TYPES, LISTING_TYPES, FURNISHED_OPTIONS } from '@/lib/constants';

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  bio: string | null;
}

interface DetailProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listingType: string;
  propertyType: string;
  country: string;
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
  agent: AgentData | null;
}

const listingBadge: Record<string, { label: string; class: string }> = {
  SALE: { label: 'For Sale', class: 'bg-navy text-white' },
  RENT: { label: 'For Rent', class: 'bg-gold text-navy' },
  COMMERCIAL: { label: 'Commercial', class: 'bg-navy-light text-white' },
};

export default function PropertyDetailClient({
  property,
  similar,
}: {
  property: DetailProperty;
  similar: PropertyCardData[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedImg, setSelectedImg] = useState(0);
  const [fav, setFav] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'viewing'>('contact');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  // Parallax on the main gallery image
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });
  const galleryY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [viewingForm, setViewingForm] = useState({ name: '', email: '', phone: '', preferredDate: '', message: '' });

  const badge = listingBadge[property.listingType] || listingBadge.SALE;
  const propTypeLabel = PROPERTY_TYPES.find((t) => t.value === property.propertyType)?.label || property.propertyType;
  const furnishedLabel = FURNISHED_OPTIONS.find((f) => f.value === property.furnished)?.label;

  const toggleFav = async () => {
    if (!session) { router.push('/auth/login'); return; }
    const newFav = !fav;
    setFav(newFav);
    await fetch('/api/favorites', {
      method: newFav ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: property.id }),
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: property.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setSuccess('Link copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push('/auth/login'); return; }
    setSubmitting(true);
    setSuccess('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactForm, propertyId: property.id, agentId: property.agent?.id }),
      });
      if (res.ok) {
        setSuccess('Your inquiry has been sent! The agent will get back to you soon.');
        setContactForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setSuccess('Failed to send inquiry. Please try again.');
      }
    } catch {
      setSuccess('Failed to send inquiry. Please try again.');
    }
    setSubmitting(false);
  };

  const handleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push('/auth/login'); return; }
    setSubmitting(true);
    setSuccess('');
    try {
      const res = await fetch('/api/viewing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...viewingForm, propertyId: property.id }),
      });
      if (res.ok) {
        setSuccess('Viewing request submitted! The agent will confirm your appointment.');
        setViewingForm({ name: '', email: '', phone: '', preferredDate: '', message: '' });
      } else {
        setSuccess('Failed to submit request. Please try again.');
      }
    } catch {
      setSuccess('Failed to submit request. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white py-6 lg:py-10">
      <div className="container-x">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-secondary">
          <Link href="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/properties" className="hover:text-gold">Properties</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-navy">{property.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2">
            {/* Gallery — cinematic crossfade + parallax */}
            <div ref={galleryRef} className="overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10]">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={selectedImg}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                  >
                    <motion.div style={{ y: galleryY }} className="absolute inset-[-8%]">
                      <Image
                        src={property.images[selectedImg] || property.mainImage}
                        alt={property.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                {/* Cinematic gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                <span className={cn('absolute left-4 top-4 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm', badge.class)}>
                  {badge.label}
                </span>
                <div className="absolute right-4 top-4 flex gap-2">
                  <motion.button onClick={toggleFav} whileTap={{ scale: 0.85 }} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110">
                    <Heart className={cn('h-5 w-5', fav ? 'fill-red-500 text-red-500' : 'text-navy')} />
                  </motion.button>
                  <motion.button onClick={handleShare} whileTap={{ scale: 0.85 }} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110">
                    <Share2 className="h-5 w-5 text-navy" />
                  </motion.button>
                </div>
              </div>
              {property.images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={cn(
                        'group/thumb relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                        selectedImg === i ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover transition-transform duration-300 group-hover/thumb:scale-110" sizes="112px" />
                      {selectedImg === i && (
                        <motion.div layoutId="thumb-active" className="absolute inset-0 ring-2 ring-gold rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + Price */}
            <div className="mt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-navy sm:text-3xl">{property.title}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-secondary">
                    <MapPin className="h-4 w-4 text-gold" />
                    {property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''} · {property.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-navy">
                    {formatPriceFull(property.price, property.currency)}
                  </p>
                  {property.listingType === 'RENT' && <p className="text-sm text-secondary">per month</p>}
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-navy/5 bg-beige/50 p-5 sm:grid-cols-4">
              {property.bedrooms !== null && (
                <div className="flex flex-col items-center text-center">
                  <Bed className="h-6 w-6 text-gold" strokeWidth={1.5} />
                  <p className="mt-1.5 text-lg font-bold text-navy">{property.bedrooms}</p>
                  <p className="text-xs text-secondary">Bedrooms</p>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex flex-col items-center text-center">
                  <Bath className="h-6 w-6 text-gold" strokeWidth={1.5} />
                  <p className="mt-1.5 text-lg font-bold text-navy">{property.bathrooms}</p>
                  <p className="text-xs text-secondary">Bathrooms</p>
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <Maximize className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <p className="mt-1.5 text-lg font-bold text-navy">{property.area.toLocaleString()}</p>
                <p className="text-xs text-secondary">{property.areaUnit}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <HomeIcon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <p className="mt-1.5 text-sm font-bold text-navy">{propTypeLabel}</p>
                <p className="text-xs text-secondary">Type</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy">About This Property</h2>
              <p className="mt-3 leading-relaxed text-secondary">{property.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {furnishedLabel && (
                  <span className="flex items-center gap-1.5 rounded-full bg-beige px-3 py-1.5 text-navy">
                    <Sofa className="h-4 w-4 text-gold" /> {furnishedLabel}
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-full bg-beige px-3 py-1.5 text-navy">
                  <Clock className="h-4 w-4 text-gold" /> Listed {formatDate(property.createdAt)}
                </span>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-navy">Amenities & Features</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-secondary">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10">
                        <Check className="h-3.5 w-3.5 text-gold" />
                      </span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy">Location</h2>
              <div className="mt-3 rounded-2xl border border-navy/5 bg-beige/50 p-5">
                <div className="flex flex-wrap gap-4 text-sm text-secondary">
                  <span><strong className="text-navy">Country:</strong> {property.country}</span>
                  <span><strong className="text-navy">City:</strong> {property.city}</span>
                  {property.neighborhood && <span><strong className="text-navy">Neighborhood:</strong> {property.neighborhood}</span>}
                  <span><strong className="text-navy">Address:</strong> {property.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Agent card */}
              {property.agent && (
                <div className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy">Listing Agent</h3>
                  <div className="mt-4 flex items-center gap-3">
                    {property.agent.image ? (
                      <Image src={property.agent.image} alt={property.agent.name} width={56} height={56} className="rounded-full object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-beige text-xl font-bold text-navy">
                        {property.agent.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-navy">{property.agent.name}</p>
                      <p className="text-xs text-secondary">Real Estate Agent</p>
                    </div>
                  </div>
                  {property.agent.bio && <p className="mt-3 text-sm text-secondary">{property.agent.bio}</p>}
                  <div className="mt-4 space-y-2 text-sm">
                    {property.agent.phone && (
                      <p className="flex items-center gap-2 text-secondary">
                        <Phone className="h-4 w-4 text-gold" /> {property.agent.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-secondary">
                      <Mail className="h-4 w-4 text-gold" /> {property.agent.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact / Viewing tabs */}
              <div className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
                <div className="flex gap-2 rounded-xl bg-beige p-1">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-colors', activeTab === 'contact' ? 'bg-white text-navy shadow-sm' : 'text-secondary')}
                  >
                    Contact Agent
                  </button>
                  <button
                    onClick={() => setActiveTab('viewing')}
                    className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-colors', activeTab === 'viewing' ? 'bg-white text-navy shadow-sm' : 'text-secondary')}
                  >
                    Request Viewing
                  </button>
                </div>

                {success && (
                  <div className={cn('mt-4 rounded-lg p-3 text-sm', success.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600')}>
                    {success}
                  </div>
                )}

                {activeTab === 'contact' ? (
                  <form onSubmit={handleContact} className="mt-4 space-y-3">
                    <input type="text" placeholder="Your Name" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="input-field" />
                    <input type="email" placeholder="Email Address" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="input-field" />
                    <input type="tel" placeholder="Phone Number" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="input-field" />
                    <textarea placeholder="Your Message" required rows={3} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="input-field resize-none" />
                    <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                      <Send className="h-4 w-4" /> Send Inquiry
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleViewing} className="mt-4 space-y-3">
                    <input type="text" placeholder="Your Name" required value={viewingForm.name} onChange={(e) => setViewingForm({ ...viewingForm, name: e.target.value })} className="input-field" />
                    <input type="email" placeholder="Email Address" required value={viewingForm.email} onChange={(e) => setViewingForm({ ...viewingForm, email: e.target.value })} className="input-field" />
                    <input type="tel" placeholder="Phone Number" value={viewingForm.phone} onChange={(e) => setViewingForm({ ...viewingForm, phone: e.target.value })} className="input-field" />
                    <input type="date" placeholder="Preferred Date" value={viewingForm.preferredDate} onChange={(e) => setViewingForm({ ...viewingForm, preferredDate: e.target.value })} className="input-field" />
                    <textarea placeholder="Message (optional)" rows={2} value={viewingForm.message} onChange={(e) => setViewingForm({ ...viewingForm, message: e.target.value })} className="input-field resize-none" />
                    <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-50">
                      <Calendar className="h-4 w-4" /> Request Viewing
                    </button>
                  </form>
                )}
                {!session && (
                  <p className="mt-3 text-center text-xs text-secondary">
                    <Link href="/auth/login" className="text-gold hover:underline">Login</Link> to contact the agent
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-navy">Similar Properties</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
