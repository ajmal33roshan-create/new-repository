export const PROPERTY_TYPES = [
  { value: 'VILLA', label: 'Villa' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'Family Home' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land & Plot' },
] as const;

export const LISTING_TYPES = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
  { value: 'COMMERCIAL', label: 'Commercial' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'AFN', label: 'AFN (؋)', symbol: '؋' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
] as const;

export const CITIES = [
  'Beverly Hills, CA',
  'Manhattan, NY',
  'Malibu, CA',
  'Miami, FL',
  'Chicago, IL',
  'Austin, TX',
  'Los Angeles, CA',
  'Seattle, WA',
  'Phoenix, AZ',
  'Portland, OR',
  'San Diego, CA',
  'Denver, CO',
];

export const AMENITIES = [
  'Swimming Pool',
  'Garden',
  'Garage',
  'Air Conditioning',
  'Gym',
  'Security System',
  'Fireplace',
  'Solar Panels',
  'Smart Home',
  'Walk-in Closet',
  'Balcony',
  'Ocean View',
  'City View',
  'Elevator',
  'Parking',
  'Pet Friendly',
  'Furnished',
  'Heating',
];

export const FURNISHED_OPTIONS = [
  { value: 'FURNISHED', label: 'Furnished' },
  { value: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { value: 'UNFURNISHED', label: 'Unfurnished' },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured' },
] as const;

export const STATS = [
  { label: 'Happy Clients', value: '12K+', icon: 'users' },
  { label: 'Properties Listed', value: '500+', icon: 'home' },
  { label: 'Cities Covered', value: '25+', icon: 'map' },
  { label: 'Customer Satisfaction', value: '98%', icon: 'heart' },
];

export const CATEGORIES = [
  { name: 'Luxury Villas', slug: 'VILLA', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80' },
  { name: 'Apartments', slug: 'APARTMENT', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
  { name: 'Family Homes', slug: 'HOUSE', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Penthouses', slug: 'PENTHOUSE', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80' },
  { name: 'Commercial', slug: 'COMMERCIAL', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Land & Plots', slug: 'LAND', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80' },
];
