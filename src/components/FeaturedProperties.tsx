import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyCard, { type PropertyCardData } from './PropertyCard';
import Reveal from './Reveal';

export default function FeaturedProperties({ properties }: { properties: PropertyCardData[] }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">FEATURED PROPERTIES</p>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Handpicked Homes for You</h2>
            <p className="mt-3 text-secondary">Explore our carefully selected properties.</p>
          </div>
          <Link href="/properties" className="btn-outline shrink-0">
            View All Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy/15 bg-beige/50 py-16 text-center">
            <p className="text-secondary">No featured properties available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.1}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-secondary/70">
          * Sample listings shown for demonstration. Replace with genuine listings when available.
        </p>
      </div>
    </section>
  );
}
