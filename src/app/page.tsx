import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import ValueProps from '@/components/ValueProps';
import FeaturedProperties from '@/components/FeaturedProperties';
import Categories from '@/components/Categories';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import Testimonials, { type TestimonialData } from '@/components/Testimonials';
import CTASection from '@/components/CTASection';

export const revalidate = 3600;

export default async function HomePage() {
  const [properties, testimonials] = await Promise.all([
    prisma.property.findMany({
      where: { status: 'APPROVED', featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.testimonial.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
  ]);

  const featuredProps = properties.map((p) => ({
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

  const testimonialData: TestimonialData[] = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    message: t.message,
    property: t.property,
    image: t.image,
    rating: t.rating,
  }));

  return (
    <>
      <HeroSection />
      <ValueProps />
      <FeaturedProperties properties={featuredProps} />
      <Categories />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials testimonials={testimonialData} />
      <CTASection />
    </>
  );
}
