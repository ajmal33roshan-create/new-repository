import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyDetailClient from './PropertyDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) return { title: 'Property Not Found | Everlight Homes' };
  return {
    title: `${property.title} | Everlight Homes`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [property.mainImage],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { agent: true },
  });

  if (!property || property.status !== 'APPROVED') {
    notFound();
  }

  const similar = await prisma.property.findMany({
    where: {
      status: 'APPROVED',
      id: { not: property.id },
      OR: [
        { propertyType: property.propertyType },
        { city: { contains: property.city } },
      ],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const parsedProperty = {
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    currency: property.currency,
    listingType: property.listingType,
    propertyType: property.propertyType,
    country: property.country,
    city: property.city,
    neighborhood: property.neighborhood,
    address: property.address,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    areaUnit: property.areaUnit,
    furnished: property.furnished,
    amenities: JSON.parse(property.amenities) as string[],
    images: JSON.parse(property.images) as string[],
    mainImage: property.mainImage,
    featured: property.featured,
    createdAt: property.createdAt.toISOString(),
    agent: property.agent ? {
      id: property.agent.id,
      name: property.agent.name,
      email: property.agent.email,
      phone: property.agent.phone,
      image: property.agent.image,
      bio: property.agent.bio,
    } : null,
  };

  const similarProps = similar.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    currency: p.currency,
    listingType: p.listingType,
    propertyType: p.propertyType,
    city: p.city,
    address: p.address,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    mainImage: p.mainImage,
    featured: p.featured,
  }));

  return <PropertyDetailClient property={parsedProperty} similar={similarProps} />;
}
