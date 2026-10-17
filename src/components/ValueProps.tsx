import { BadgeCheck, ShieldCheck, Headset, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

const features = [
  { icon: BadgeCheck, title: 'Verified Listings', desc: 'Genuine properties with verified listing information.' },
  { icon: ShieldCheck, title: 'Trusted & Secure', desc: 'A transparent and secure property discovery experience.' },
  { icon: Headset, title: 'Expert Support', desc: 'Helpful assistance throughout the property journey.' },
  { icon: Sparkles, title: 'Better Living', desc: 'Discover homes that fit your lifestyle.' },
];

export default function ValueProps() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="group flex flex-col items-center rounded-2xl border border-navy/5 bg-white p-6 text-center shadow-card transition-all hover:shadow-card-hover sm:items-start sm:text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-beige transition-colors group-hover:bg-gold/10">
                  <f.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
