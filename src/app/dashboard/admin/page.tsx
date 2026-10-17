'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, Users, Mail, Calendar, Check, X, Archive, Trash2,
  TrendingUp, Clock, Shield, Building,
} from 'lucide-react';
import { cn, formatPriceFull, formatDate } from '@/lib/utils';

interface AdminListing {
  id: string; title: string; price: number; currency: string;
  listingType: string; propertyType: string; city: string;
  mainImage: string; status: string; featured: boolean; createdAt: string;
  bedrooms: number | null; bathrooms: number | null; area: number;
}

interface AdminUser {
  id: string; name: string; email: string; role: string;
  phone: string | null; createdAt: string;
  _count: { properties: number };
}

interface AdminInquiry {
  id: string; name: string; email: string; phone: string | null;
  message: string; status: string; createdAt: string;
  property: { title: string } | null;
}

interface AdminViewing {
  id: string; name: string; email: string; phone: string | null;
  preferredDate: string | null; status: string; createdAt: string;
  property: { title: string } | null;
}

const statusColors: Record<string, string> = {
  APPROVED: 'bg-green-50 text-green-600', PENDING: 'bg-yellow-50 text-yellow-600',
  REJECTED: 'bg-red-50 text-red-600', ARCHIVED: 'bg-gray-100 text-gray-500',
  NEW: 'bg-blue-50 text-blue-600', CONFIRMED: 'bg-green-50 text-green-600',
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'properties' | 'users' | 'inquiries' | 'viewings'>('overview');
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [viewings, setViewings] = useState<AdminViewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [l, u, i, v] = await Promise.all([
      fetch('/api/listings').then((r) => r.json()),
      fetch('/api/admin/users').then((r) => r.json()),
      fetch('/api/inquiries').then((r) => r.json()),
      fetch('/api/viewing-requests').then((r) => r.json()),
    ]);
    if (Array.isArray(l)) setListings(l);
    if (Array.isArray(u)) setUsers(u);
    if (Array.isArray(i)) setInquiries(i);
    if (Array.isArray(v)) setViewings(v);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/login'); return; }
    if ((session.user as any).role !== 'ADMIN') { router.push('/dashboard'); return; }
    fetchData();
  }, [session, status, router, fetchData]);

  const updatePropertyStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setListings(listings.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    setActionLoading(null);
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    setActionLoading(id);
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !featured }),
    });
    setListings(listings.map((l) => l.id === id ? { ...l, featured: !featured } : l));
    setActionLoading(null);
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    setActionLoading(id);
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    setListings(listings.filter((l) => l.id !== id));
    setActionLoading(null);
  };

  const changeRole = async (userId: string, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    setUsers(users.map((u) => u.id === userId ? { ...u, role } : u));
  };

  if (status === 'loading' || loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === 'PENDING').length,
    approved: listings.filter((l) => l.status === 'APPROVED').length,
    users: users.length,
    agents: users.filter((u) => u.role === 'AGENT').length,
    inquiries: inquiries.length,
    viewings: viewings.length,
  };

  return (
    <div className="bg-beige py-8 lg:py-12">
      <div className="container-x">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
          <p className="mt-1 text-secondary">Manage properties, users, and inquiries</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl bg-white p-1 shadow-card">
          {[
            { key: 'overview', label: 'Overview', icon: TrendingUp },
            { key: 'properties', label: 'Properties', icon: Home, count: listings.length },
            { key: 'users', label: 'Users', icon: Users, count: users.length },
            { key: 'inquiries', label: 'Inquiries', icon: Mail, count: inquiries.length },
            { key: 'viewings', label: 'Viewings', icon: Calendar, count: viewings.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors', tab === t.key ? 'bg-navy text-white' : 'text-secondary hover:bg-beige')}
            >
              <t.icon className="h-4 w-4" /> {t.label}
              {t.count !== undefined && <span className={cn('rounded-full px-2 py-0.5 text-xs', tab === t.key ? 'bg-white/20' : 'bg-beige')}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Properties', value: stats.total, icon: Home },
              { label: 'Pending Approval', value: stats.pending, icon: Clock },
              { label: 'Approved', value: stats.approved, icon: Check },
              { label: 'Total Users', value: stats.users, icon: Users },
              { label: 'Agents', value: stats.agents, icon: Shield },
              { label: 'Inquiries', value: stats.inquiries, icon: Mail },
              { label: 'Viewing Requests', value: stats.viewings, icon: Calendar },
              { label: 'Featured', value: listings.filter((l) => l.featured).length, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
                <s.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <p className="mt-2 text-2xl font-bold text-navy">{s.value}</p>
                <p className="text-xs text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Properties */}
        {tab === 'properties' && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
                <p className="text-secondary">No properties found.</p>
              </div>
            ) : (
              listings.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-navy/5 bg-white p-4 shadow-card">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={l.mainImage} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/properties/${l.id}`} className="font-medium text-navy hover:text-gold">{l.title}</Link>
                    <p className="text-sm text-secondary">{l.city} · {formatPriceFull(l.price, l.currency)}</p>
                  </div>
                  <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusColors[l.status] || 'bg-gray-100')}>{l.status}</span>
                  <div className="flex gap-1">
                    {l.status !== 'APPROVED' && (
                      <button onClick={() => updatePropertyStatus(l.id, 'APPROVED')} disabled={actionLoading === l.id} title="Approve" className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {l.status !== 'REJECTED' && (
                      <button onClick={() => updatePropertyStatus(l.id, 'REJECTED')} disabled={actionLoading === l.id} title="Reject" className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {l.status !== 'ARCHIVED' && (
                      <button onClick={() => updatePropertyStatus(l.id, 'ARCHIVED')} disabled={actionLoading === l.id} title="Archive" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50">
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => toggleFeatured(l.id, l.featured)} disabled={actionLoading === l.id} title={l.featured ? 'Unfeature' : 'Feature'} className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-50', l.featured ? 'bg-gold/20 text-gold' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100')}>
                      <TrendingUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteProperty(l.id)} disabled={actionLoading === l.id} title="Delete" className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="overflow-x-auto rounded-2xl border border-navy/5 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="border-b border-navy/5 bg-beige/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Listings</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-navy/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-navy">{u.name}</td>
                    <td className="px-4 py-3 text-secondary">{u.email}</td>
                    <td className="px-4 py-3 text-secondary">{u._count.properties}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="rounded-lg border border-navy/15 bg-white px-2 py-1 text-xs font-medium text-navy outline-none focus:border-gold"
                      >
                        <option value="USER">USER</option>
                        <option value="AGENT">AGENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-secondary">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inquiries */}
        {tab === 'inquiries' && (
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
                <p className="text-secondary">No inquiries found.</p>
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

        {/* Viewings */}
        {tab === 'viewings' && (
          <div className="space-y-3">
            {viewings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
                <p className="text-secondary">No viewing requests found.</p>
              </div>
            ) : (
              viewings.map((vr) => (
                <div key={vr.id} className="flex items-center gap-4 rounded-xl border border-navy/5 bg-white p-4 shadow-card">
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
