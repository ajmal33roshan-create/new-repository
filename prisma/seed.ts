import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const interiorImages = [
  '1600585154340-be6161a56a0c',
  '1586023492125-27b2c045efd7',
  '1570129477492-45c003edd2be',
  '1545324418-cc1a3fa10c00',
];

const properties = [
  {
    title: 'Modern Glass Villa with Infinity Pool',
    description: 'Stunning architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking the city, and seamless indoor-outdoor living. This villa represents the pinnacle of modern luxury design with premium finishes throughout.',
    price: 2850000, currency: 'USD', listingType: 'SALE', propertyType: 'VILLA',
    city: 'Beverly Hills, CA', neighborhood: 'Beverly Crest', address: '1289 Sunset Boulevard',
    bedrooms: 5, bathrooms: 4, area: 4200, furnished: 'SEMI_FURNISHED',
    main: '1570129477492-45c003edd2be', featured: true,
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Security System', 'Smart Home', 'Solar Panels', 'City View'],
  },
  {
    title: 'Skyline Penthouse Suite',
    description: 'An extraordinary penthouse with panoramic city views, private rooftop terrace, and designer interiors. Floor-to-ceiling windows flood the space with natural light. Includes private elevator access and dedicated concierge service.',
    price: 4200000, currency: 'USD', listingType: 'SALE', propertyType: 'PENTHOUSE',
    city: 'Manhattan, NY', neighborhood: 'Upper East Side', address: '5th Avenue, Apt PH',
    bedrooms: 3, bathrooms: 3, area: 2800, furnished: 'FURNISHED',
    main: '1600047509807-ba8f99d2cdde', featured: true,
    amenities: ['Elevator', 'Air Conditioning', 'Gym', 'Security System', 'City View', 'Smart Home', 'Parking', 'Heating'],
  },
  {
    title: 'Coastal Family Home',
    description: 'A beautiful family home steps from the beach. Open-plan living areas, gourmet kitchen, and a spacious backyard perfect for family life. Features include a two-car garage, solar panels, and a master suite with ocean views.',
    price: 1950000, currency: 'USD', listingType: 'SALE', propertyType: 'HOUSE',
    city: 'Malibu, CA', neighborhood: 'Malibu Colony', address: '25034 Pacific Coast Hwy',
    bedrooms: 4, bathrooms: 3, area: 3100, furnished: 'UNFURNISHED',
    main: '1600585154340-be6161a56a0c', featured: true,
    amenities: ['Garden', 'Garage', 'Air Conditioning', 'Fireplace', 'Solar Panels', 'Ocean View', 'Pet Friendly', 'Heating'],
  },
  {
    title: 'Beachfront Luxury Estate',
    description: 'Direct beach access from this magnificent estate. Features include a private pool, outdoor kitchen, home theater, and wine cellar. The property offers unparalleled oceanfront living with 150 feet of private beach frontage.',
    price: 3500000, currency: 'USD', listingType: 'SALE', propertyType: 'VILLA',
    city: 'Miami, FL', neighborhood: 'South Beach', address: '89 Collins Avenue',
    bedrooms: 6, bathrooms: 5, area: 5500, furnished: 'FURNISHED',
    main: '1582268611958-ebfd161ef9cf', featured: true,
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Gym', 'Security System', 'Smart Home', 'Ocean View'],
  },
  {
    title: 'Modern Downtown Apartment',
    description: 'Sleek, contemporary apartment in the heart of the city. Building amenities include 24/7 concierge, fitness center, and rooftop lounge. The unit features hardwood floors, stainless steel appliances, and a private balcony.',
    price: 4500, currency: 'USD', listingType: 'RENT', propertyType: 'APARTMENT',
    city: 'Chicago, IL', neighborhood: 'River North', address: '401 N Wacker Drive, Apt 1802',
    bedrooms: 2, bathrooms: 2, area: 1200, furnished: 'FURNISHED',
    main: '1545324418-cc1a3fa10c00', featured: false,
    amenities: ['Elevator', 'Air Conditioning', 'Gym', 'Security System', 'City View', 'Parking', 'Pet Friendly', 'Heating'],
  },
  {
    title: 'Suburban Family House',
    description: 'Charming family home in a top-rated school district. Features include a renovated kitchen, hardwood floors, fenced backyard, and a finished basement. Move-in ready with recent updates to plumbing and electrical.',
    price: 650000, currency: 'USD', listingType: 'SALE', propertyType: 'HOUSE',
    city: 'Austin, TX', neighborhood: 'Westlake Hills', address: '4207 Hillcrest Drive',
    bedrooms: 4, bathrooms: 2, area: 2400, furnished: 'UNFURNISHED',
    main: '1570129477492-45c003edd2be', featured: false,
    amenities: ['Garden', 'Garage', 'Air Conditioning', 'Fireplace', 'Pet Friendly', 'Heating', 'Walk-in Closet', 'Parking'],
  },
  {
    title: 'Luxury Hillside Estate',
    description: 'A breathtaking estate perched on the hills with sweeping city and ocean views. Features include a tennis court, infinity pool, home automation system, and a 6-car gallery garage. Architectural excellence meets natural beauty.',
    price: 5900000, currency: 'USD', listingType: 'SALE', propertyType: 'VILLA',
    city: 'Los Angeles, CA', neighborhood: 'Bel Air', address: '1000 Stradella Road',
    bedrooms: 7, bathrooms: 6, area: 6800, furnished: 'SEMI_FURNISHED',
    main: '1600047509807-ba8f99d2cdde', featured: true,
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Gym', 'Security System', 'Smart Home', 'City View', 'Solar Panels'],
  },
  {
    title: 'Urban Industrial Loft',
    description: 'Converted warehouse loft with exposed brick, 14-foot ceilings, and oversized windows. A unique living space in a vibrant neighborhood close to cafes, galleries, and nightlife. Includes one deeded parking space.',
    price: 3200, currency: 'USD', listingType: 'RENT', propertyType: 'APARTMENT',
    city: 'Seattle, WA', neighborhood: 'Pioneer Square', address: '315 Occidental Ave S, Loft 4',
    bedrooms: 1, bathrooms: 1, area: 950, furnished: 'UNFURNISHED',
    main: '1586023492125-27b2c045efd7', featured: false,
    amenities: ['Elevator', 'Heating', 'Pet Friendly', 'Parking', 'City View'],
  },
  {
    title: 'Garden Villa with Resort Pool',
    description: 'Mediterranean-inspired villa with lush gardens, a resort-style pool, and outdoor entertaining areas. The home features vaulted ceilings, a gourmet kitchen, and a separate guest house. Perfect for those who love to entertain.',
    price: 1200000, currency: 'USD', listingType: 'SALE', propertyType: 'VILLA',
    city: 'Phoenix, AZ', neighborhood: 'Paradise Valley', address: '7050 E McDonald Drive',
    bedrooms: 4, bathrooms: 3, area: 3200, furnished: 'UNFURNISHED',
    main: '1600585154340-be6161a56a0c', featured: false,
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Fireplace', 'Solar Panels', 'Pet Friendly', 'Heating'],
  },
  {
    title: 'Modern Townhouse',
    description: 'Contemporary 3-story townhouse with rooftop deck and city views. Features include a 2-car attached garage, smart home integration, and energy-efficient design. Located in a walkable neighborhood close to shops and transit.',
    price: 725000, currency: 'USD', listingType: 'SALE', propertyType: 'HOUSE',
    city: 'Portland, OR', neighborhood: 'Pearl District', address: '1420 NW Lovejoy Street',
    bedrooms: 3, bathrooms: 2, area: 1800, furnished: 'UNFURNISHED',
    main: '1570129477492-45c003edd2be', featured: false,
    amenities: ['Garage', 'Air Conditioning', 'Smart Home', 'City View', 'Heating', 'Walk-in Closet', 'Solar Panels'],
  },
  {
    title: 'Waterfront Property with Private Dock',
    description: 'Exceptional waterfront living with a private dock and stunning bay views. This property features a modern design, expansive outdoor living spaces, and direct water access. A rare opportunity for the discerning buyer.',
    price: 2400000, currency: 'USD', listingType: 'SALE', propertyType: 'VILLA',
    city: 'San Diego, CA', neighborhood: 'La Jolla Shores', address: '8300 La Jolla Shores Drive',
    bedrooms: 5, bathrooms: 4, area: 4000, furnished: 'SEMI_FURNISHED',
    main: '1582268611958-ebfd161ef9cf', featured: true,
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Air Conditioning', 'Security System', 'Smart Home', 'Ocean View', 'Solar Panels'],
  },
  {
    title: 'Premium Commercial Office Space',
    description: 'Class A office space in a premier business district. Features include floor-to-ceiling windows, raised floors, HVAC, and 24/7 building access. Ideal for corporate headquarters or professional services firm.',
    price: 12000, currency: 'USD', listingType: 'COMMERCIAL', propertyType: 'COMMERCIAL',
    city: 'Denver, CO', neighborhood: 'LoDo', address: '1625 Broadway, Suite 2100',
    bedrooms: 0, bathrooms: 2, area: 3500, furnished: 'UNFURNISHED',
    main: '1497366216548-37526070297c', featured: false,
    amenities: ['Elevator', 'Air Conditioning', 'Security System', 'Parking', 'City View', 'Heating'],
  },
];

const testimonials = [
  { name: 'Sarah Mitchell', message: 'Everlight Homes made our dream of owning a beachfront property a reality. Their team was professional, responsive, and genuinely cared about finding the right home for our family.', property: 'Beachfront Luxury Estate, Miami', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { name: 'James Anderson', message: 'The entire process was seamless. From the first viewing to closing day, everything was handled with exceptional care. I highly recommend Everlight to anyone looking for a premium property.', property: 'Skyline Penthouse Suite, Manhattan', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { name: 'Emily Roberts', message: 'As a first-time homebuyer, I was nervous about the process. The Everlight team guided me through every step and found me a beautiful home within my budget. Truly grateful!', property: 'Suburban Family House, Austin', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  { name: 'Michael Chen', message: 'I have worked with many real estate agencies, but Everlight stands out. Their attention to detail, market knowledge, and commitment to client satisfaction is unmatched.', property: 'Modern Glass Villa, Beverly Hills', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
];

async function main() {
  console.log('Seeding database...');

  // Skip if already seeded
  const existing = await prisma.property.count();
  if (existing > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  // Create users
  const adminPass = await bcrypt.hash('admin123', 10);
  const agentPass = await bcrypt.hash('agent123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@everlight.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@everlight.com', password: adminPass, role: 'ADMIN', phone: '+1 (555) 010-0000' },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@everlight.com' },
    update: {},
    create: { name: 'Sophia Reynolds', email: 'agent@everlight.com', password: agentPass, role: 'AGENT', phone: '+1 (555) 010-1234', bio: 'Senior real estate agent with 10+ years of experience in luxury properties.' },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@everlight.com' },
    update: {},
    create: { name: 'John Davis', email: 'user@everlight.com', password: userPass, role: 'USER', phone: '+1 (555) 010-5678' },
  });

  console.log('Users created:', { admin: admin.email, agent: agent.email, user: regularUser.email });

  // Create properties
  for (const p of properties) {
    const images = JSON.stringify([img(p.main), ...interiorImages.slice(0, 4).map(i => img(i))]);
    await prisma.property.create({
      data: {
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
        furnished: p.furnished,
        amenities: JSON.stringify(p.amenities),
        images,
        mainImage: img(p.main),
        agentId: agent.id,
        status: 'APPROVED',
        featured: p.featured,
      },
    });
  }
  console.log(`${properties.length} properties created`);

  // Create testimonials
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`${testimonials.length} testimonials created`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
