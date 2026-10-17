'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, Mail, Calendar, Plus, ArrowRight, Check, X, Archive,
  TrendingUp, Clock, Eye,
} from 'lucide-react';
import { cn, formatPriceFull, formatDate } from '@/lib/utils';

interface Listing {
  id: string; title: string; price: number; currency: string;
  listingType: string; propertyType: string; city: string;
  mainImage: string; status: string; featured: boolean; createdAt: string;
  bedrooms: number | null; bathrooms: number | null; area: number;
}

interface Inquiry {
  id: string; name: string; email: string; phone: string | null;
  message: string; status: string; createdAt: string;
  property: { title: string; mainImage: string } | null;
}

interface ViewingRequest {
  id: string; name: string; email: string; phone: string | null;
  preferredDate: string | null; status: string; createdAt: string;
  property: { title: string; mainImage: string } | null;
}

const statusColors: Record<string, string> = {
  APPROVED: 'bg-green-50 text-green-600',
  PENDING: 'bg-yellow-50 text-yellow-600',
  REJECTED: 'bg-red-50 text-red-600',
  ARCHIVED: 'bg-gray-100 text-gray-500',
  NEW: 'bg-blue-50 text-blue-600',
  READ: 'bg-gray-100 text-gray-500',
  CONFIRMED: 'bg-green-50 text-green-600',
  COMPLETED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-600',
};

export default function AgentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<'listings' | 'inquiries' | 'viewings'>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [viewings, setViewings] = useState<ViewingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [l, i, v] = await Promise.all([
      fetch('/api/listings').then((r) => r.json()),
      fetch('/api/inquiries').then((r) => r.json()),
      fetch('/api/viewing-requests').then((r) => r.json()),
    ]);
    if (Array.isArray(l)) setListings(l);
    if (Array.isArray(i)) setInquiries(i);
    if (Array.isArray(v)) setViewings(v);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/login'); return; }
    const role = (session.user as any).role;
    if (role !== 'AGENT' && role !== 'ADMIN') { router.push('/dashboard'); return; }
    fetchData();
  }, [session, status, router, fetchData]);

  if (status === 'loading' || loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  const stats = {
    total: listings.length,
    approved: listings.filter((l) => l.status === 'APPROVED').length,
    pending: listings.filter((l) => l.status === 'PENDING').length,
    inquiries: inquiries.length,
  };

  return (
    <div className="bg-beige py-8 lg:py-12">
      <div className="container-x">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Agent Dashboard</h1>
            <p className="mt-1 text-secondary">Manage your listings and inquiries</p>
          </div>
          <Link href="/list-property" className="btn-gold">
            <Plus className="h-4 w-4" /> Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Listings', value: stats.total, icon: Home },
            { label: 'Approved', value: stats.approved, icon: Check },
            { label: 'Pending Review', value: stats.pending, icon: Clock },
            { label: 'Inquiries', value: stats.inquiries, icon: Mail },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
              <s.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              <p className="mt-2 text-2xl font-bold text-navy">{s.value}</p>
              <p className="text-xs text-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 rounded-xl bg-white p-1 shadow-card">
          {[
            { key: 'listings', label: 'My Listings', count: listings.length },
            { key: 'inquiries', label: 'Inquiries', count: inquiries.length },
            { key: 'viewings', label: 'Viewing Requests', count: viewings.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors', tab === t.key ? 'bg-navy text-white' : 'text-secondary hover:bg-beige')}
            >
              {t.label}
              <span className={cn('rounded-full px-2 py-0.5 text-xs', tab === t.key ? 'bg-white/20' : 'bg-beige')}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'listings' && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
                <p className="text-secondary">No listings yet. <Link href="/list-property" className="text-gold hover:underline">Add your first property</Link>.</p>
              </div>
            ) : (
              listings.map((l) => (
                <div key={l.id} className="flex items-center gap-4 rounded-xl border border-navy/5 bg-white p-4 shadow-card">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={l.mainImage} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/properties/${l.id}`} className="font-medium text-navy hover:text-gold">{l.title}</Link>
                    <p className="text-sm text-secondary">{l.city} · {formatPriceFull(l.price, l.currency)} · {l.bedrooms || 0} bed, {l.bathrooms || 0} bath</p>
                  </div>
                  <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusColors[l.status] || 'bg-gray-100')}>{l.status}</span>
                  {l.featured && <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">Featured</span>}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'inquiries' && (
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
                <p className="text-secondary">No inquiries yet.</p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="rounded-xl border border-navy/5 bg-white p-4 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-navy">{inq.name}</p>
                      <p className="text-sm text-secondary">{inq.email}{inq.phone && ` · ${inq.phone}`}</p>
                      {inq.property && <p className="mt-1 text-xs text-gold">Re: {inq.property.title}</p>}
                      <p className="mt-2 text-sm text-secondary">{inq.message}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusColors[inq.status] || 'bg-gray-100')}>{inq.status}</span>
                      <p className="mt-1 text-xs text-secondary">{formatDate(inq.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'viewings' && (
          <div className="space-y-3">
            {viewings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
                <p className="text-secondary">No viewing requests yet.</p>
              </div>
            ) : (
              viewings.map((vr) => (
                <div key={vr.id} className="flex items-center gap-4 rounded-xl border border-navy/5 bg-white p-4 shadow-card">
                  {vr.property && (
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image src={vr.property.mainImage} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-navy">{vr.name}</p>
                    <p className="text-sm text-secondary">{vr.email}{vr.phone && ` · ${vr.phone}`}</p>
                    {vr.property && <p className="text-xs text-gold">{vr.property.title}</p>}
                    {vr.preferredDate && <p className="text-xs text-secondary">Preferred: {formatDate(vr.preferredDate)}</p>}
                  </div>
                  <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusColors[vr.status] || 'bg-gray-100')}>{vr.status}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
