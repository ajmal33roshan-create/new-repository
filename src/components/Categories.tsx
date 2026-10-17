import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import Reveal from './Reveal';

export default function Categories() {
  return (
    <section className="bg-beige py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-10 text-center">
          <p className="section-label">EXPLORE BY CATEGORY</p>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Browse Property Types</h2>
          <p className="mt-3 text-secondary">Find the perfect property type for your needs</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.05}>
              <Link
                href={`/properties?propertyType=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/80 transition-all group-hover:text-gold">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
