import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Please sign in to list a property.' }, { status: 401 });

  const body = await req.json();
  const {
    title, description, price, currency, listingType, propertyType,
    country, city, neighborhood, address, bedrooms, bathrooms, area, areaUnit,
    furnished, amenities, images, mainImage, contactName, contactEmail, contactPhone,
  } = body;

  if (!title || !price || !listingType || !propertyType || !city || !address || !description) {
    return NextResponse.json({ message: 'Please fill in all required fields.' }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Find or create agent profile
  let agentId = userId;
  if (role === 'ADMIN' || role === 'AGENT') {
    agentId = userId;
  } else {
    // Regular users list as themselves; admin will assign an agent later
    agentId = userId;
  }

  const property = await prisma.property.create({
    data: {
      title,
      description,
      price: Number(price),
      currency: currency || 'USD',
      listingType,
      propertyType,
      country: country || 'United States',
      city,
      neighborhood: neighborhood || null,
      address,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      area: Number(area) || 0,
      areaUnit: areaUnit || 'sqft',
      furnished: furnished || null,
      amenities: JSON.stringify(amenities || []),
      images: JSON.stringify(images || []),
      mainImage: mainImage || (images && images[0]) || 'https://images.unsplash.com/photo-1564013799919-ab6000b0b8c4?auto=format&fit=crop&w=800&q=80',
      agentId,
      status: 'PENDING',
      featured: false,
    },
  });

  return NextResponse.json({ success: true, id: property.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  const where = role === 'ADMIN' ? {} : { agentId: userId };
  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, price: true, currency: true, listingType: true,
      propertyType: true, city: true, mainImage: true, status: true, featured: true,
      createdAt: true, bedrooms: true, bathrooms: true, area: true,
    },
  });
  return NextResponse.json(properties);
}
