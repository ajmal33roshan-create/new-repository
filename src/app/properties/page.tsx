import { prisma } from '@/lib/prisma';
import PropertiesClient from './PropertiesClient';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | undefined>;

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const where: any = { status: 'APPROVED' };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { city: { contains: searchParams.q } },
      { neighborhood: { contains: searchParams.q } },
      { address: { contains: searchParams.q } },
    ];
  }
  if (searchParams.listingType) where.listingType = searchParams.listingType;
  if (searchParams.propertyType) where.propertyType = searchParams.propertyType;
  if (searchParams.city) where.city = { contains: searchParams.city };
  if (searchParams.minPrice) where.price = { ...where.price, gte: Number(searchParams.minPrice) };
  if (searchParams.maxPrice) where.price = { ...where.price, lte: Number(searchParams.maxPrice) };
  if (searchParams.bedrooms) where.bedrooms = { gte: Number(searchParams.bedrooms) };
  if (searchParams.bathrooms) where.bathrooms = { gte: Number(searchParams.bathrooms) };
  if (searchParams.minArea) where.area = { ...where.area, gte: Number(searchParams.minArea) };
  if (searchParams.maxArea) where.area = { ...where.area, lte: Number(searchParams.maxArea) };
  if (searchParams.furnished) where.furnished = searchParams.furnished;

  if (searchParams.amenities) {
    const amenityList = searchParams.amenities.split(',').filter(Boolean);
    if (amenityList.length > 0) {
      if (!where.AND) where.AND = [];
      amenityList.forEach((a: string) => {
        where.AND.push({ amenities: { contains: a } });
      });
    }
  }

  const sort = searchParams.sort || 'newest';
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-low') orderBy = { price: 'asc' };
  if (sort === 'price-high') orderBy = { price: 'desc' };
  if (sort === 'featured') orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];

  const page = Number(searchParams.page) || 1;
  const pageSize = 9;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  const parsedProperties = properties.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    currency: p.currency,
    listingType: p.listingType,
    propertyType: p.propertyType,
    city: p.city,
    neighborhood: p.neighborhood,
    address: p.address,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    areaUnit: p.areaUnit,
    furnished: p.furnished,
    amenities: JSON.parse(p.amenities) as string[],
    images: JSON.parse(p.images) as string[],
    mainImage: p.mainImage,
    featured: p.featured,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <PropertiesClient
      properties={parsedProperties}
      total={total}
      page={page}
      pageSize={pageSize}
      searchParams={searchParams}
    />
  );
}
