import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Calendar, Mail, Home, ArrowRight, User as UserIcon, Settings } from 'lucide-react';
import PropertyCard, { type PropertyCardData } from '@/components/PropertyCard';
import { formatPriceFull, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const userId = (session.user as any).id;
  const userEmail = session.user.email as string;
  const role = (session.user as any).role;

  const [favorites, viewingRequests, inquiries, myListings] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      include: { property: true },
    }),
    prisma.viewingRequest.findMany({
      where: { email: userEmail },
      include: { property: { select: { title: true, mainImage: true, id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.inquiry.findMany({
      where: { email: userEmail },
      include: { property: { select: { title: true, id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.property.findMany({
      where: { agentId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const favProperties: PropertyCardData[] = favorites
    .map((f) => f.property)
    .filter((p) => p.status === 'APPROVED')
    .map((p) => ({
      id: p.id, title: p.title, price: p.price, currency: p.currency,
      listingType: p.listingType, propertyType: p.propertyType, city: p.city,
      address: p.address, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      area: p.area, mainImage: p.mainImage, featured: p.featured,
    }));

  return (
    <div className="bg-beige py-8 lg:py-12">
      <div className="container-x">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">My Dashboard</h1>
            <p className="mt-1 text-secondary">Welcome back, {session.user.name}!</p>
          </div>
          <div className="flex gap-2">
            {(role === 'AGENT' || role === 'ADMIN') && (
              <Link href="/dashboard/agent" className="btn-outline">
                <Settings className="h-4 w-4" /> Agent Panel
              </Link>
            )}
            {role === 'ADMIN' && (
              <Link href="/dashboard/admin" className="btn-primary">
                Admin Panel <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
            <Heart className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <p className="mt-2 text-2xl font-bold text-navy">{favProperties.length}</p>
            <p className="text-xs text-secondary">Favorites</p>
          </div>
          <div className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
            <Calendar className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <p className="mt-2 text-2xl font-bold text-navy">{viewingRequests.length}</p>
            <p className="text-xs text-secondary">Viewing Requests</p>
          </div>
          <div className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
            <Mail className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <p className="mt-2 text-2xl font-bold text-navy">{inquiries.length}</p>
            <p className="text-xs text-secondary">Inquiries</p>
          </div>
          <div className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
            <Home className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <p className="mt-2 text-2xl font-bold text-navy">{myListings.length}</p>
            <p className="text-xs text-secondary">My Listings</p>
          </div>
        </div>

        {/* Profile */}
        <div className="mb-8 rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <UserIcon className="h-5 w-5 text-gold" /> Profile Information
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-secondary">Name</p>
              <p className="font-medium text-navy">{session.user.name}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Email</p>
              <p className="font-medium text-navy">{session.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Role</p>
              <p className="font-medium text-navy">{role}</p>
            </div>
          </div>
        </div>

        {/* Favorites */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy">
            <Heart className="h-5 w-5 text-gold" /> Favorite Properties
          </h2>
          {favProperties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
              <p className="text-secondary">No favorites yet. <Link href="/properties" className="text-gold hover:underline">Browse properties</Link> to add some.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>

        {/* Viewing Requests */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy">
            <Calendar className="h-5 w-5 text-gold" /> Recent Viewing Requests
          </h2>
          {viewingRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-12 text-center">
              <p className="text-secondary">No viewing requests yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {viewingRequests.map((vr) => (
                <div key={vr.id} className="flex items-center gap-4 rounded-xl border border-navy/5 bg-white p-4 shadow-card">
                  {vr.property && (
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image src={vr.property.mainImage} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-navy">{vr.property?.title || 'Property'}</p>
                    <p className="text-sm text-secondary">
                      {vr.preferredDate ? `Preferred: ${formatDate(vr.preferredDate)}` : 'Date not specified'}
                    </p>
                  </div>
                  <span className="rounded-full bg-beige px-3 py-1 text-xs font-medium text-navy">{vr.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Listings */}
        {myListings.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
                <Home className="h-5 w-5 text-gold" /> My Listings
              </h2>
              <Link href="/list-property" className="btn-gold">List New Property</Link>
            </div>
            <div className="space-y-3">
              {myListings.map((p) => (
                <Link key={p.id} href={`/properties/${p.id}`} className="flex items-center gap-4 rounded-xl border border-navy/5 bg-white p-4 shadow-card transition-all hover:shadow-card-hover">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={p.mainImage} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy">{p.title}</p>
                    <p className="text-sm text-secondary">{p.city} · {formatPriceFull(p.price, p.currency)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${p.status === 'APPROVED' ? 'bg-green-50 text-green-600' : p.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                    {p.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
