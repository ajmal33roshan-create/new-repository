import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

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
              <TiltCard max={10} scale={1.03} className="group h-full">
                <Link
                  href={`/properties?propertyType=${cat.slug}`}
                  className="group relative block aspect-[3/4] h-full overflow-hidden rounded-2xl"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent transition-opacity duration-500 group-hover:from-navy/90" />
                  {/* Shimmer sweep */}
                  <div className="shimmer-sweep pointer-events-none absolute inset-0" />
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="text-sm font-semibold text-white transition-transform duration-300 group-hover:-translate-y-1">{cat.name}</h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/80 transition-all duration-300 group-hover:text-gold group-hover:gap-2">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
