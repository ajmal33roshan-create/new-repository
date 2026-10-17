import Image from 'next/image';
import { Star } from 'lucide-react';
import Reveal from './Reveal';

export interface TestimonialData {
  id: string;
  name: string;
  message: string;
  property: string | null;
  image: string | null;
  rating: number;
}

export default function Testimonials({ testimonials }: { testimonials: TestimonialData[] }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-10 text-center">
          <p className="section-label">TESTIMONIALS</p>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-navy/5 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={j < t.rating ? 'h-4 w-4 fill-gold text-gold' : 'h-4 w-4 text-navy/10'}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-secondary">
                  &ldquo;{t.message}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-navy/5 pt-4">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-beige text-sm font-bold text-navy">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-navy">{t.name}</p>
                    {t.property && <p className="text-xs text-secondary">{t.property}</p>}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-secondary/70">
          * Sample testimonials shown for demonstration.
        </p>
      </div>
    </section>
  );
}
