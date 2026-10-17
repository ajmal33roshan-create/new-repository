import { Users, Home, MapPin, Heart } from 'lucide-react';
import Reveal from './Reveal';
import ParallaxImage from './ParallaxImage';

const stats = [
  { label: 'Happy Clients', value: '12K+', icon: Users },
  { label: 'Properties Listed', value: '500+', icon: Home },
  { label: 'Cities Covered', value: '25+', icon: MapPin },
  { label: 'Customer Satisfaction', value: '98%', icon: Heart },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left image — parallax depth */}
          <Reveal>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-hover">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Bright modern living room interior"
                className="h-full w-full"
                sizes="(max-width: 1024px) 100vw, 50vw"
                offset={40}
              />
              {/* Cinematic overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-2xl glass-panel px-5 py-3 shadow-lg">
                <p className="text-sm font-semibold text-navy">More Than Just a Home</p>
              </div>
            </div>
          </Reveal>

          {/* Right content */}
          <div>
            <Reveal>
              <p className="section-label">WHY CHOOSE EVERLIGHT</p>
              <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
                More Than Properties. We Build Futures.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-secondary">
                Whether you&apos;re buying, selling, or renting, we make the process simple, transparent, and stress-free. Your dream home is closer than you think.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1}>
                  <div className="group rounded-2xl border border-navy/5 bg-beige/50 p-5 text-center transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                    <s.icon className="mx-auto h-6 w-6 text-gold transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                    <p className="mt-2 text-2xl font-bold text-navy">{s.value}</p>
                    <p className="text-xs text-secondary">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-4 text-xs text-secondary/60">
              * Demo values — replace with actual business data when available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
