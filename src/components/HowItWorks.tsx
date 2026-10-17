import { Search, CalendarCheck, KeyRound } from 'lucide-react';
import Reveal from './Reveal';

const steps = [
  { icon: Search, title: 'Discover Properties', desc: 'Search and explore homes that match your needs.' },
  { icon: CalendarCheck, title: 'Schedule a Viewing', desc: 'Contact the agent and request a property visit.' },
  { icon: KeyRound, title: 'Find Your Dream Home', desc: 'Get assistance with the next steps in your property journey.' },
];

export default function HowItWorks() {
  return (
    <section className="bg-beige py-16 lg:py-20">
      <div className="container-x">
        <div className="mb-12 text-center">
          <p className="section-label">HOW IT WORKS</p>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Your Journey in Three Steps</h2>
        </div>
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.15}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-card-hover">
                  <step.icon className="h-8 w-8 text-gold" strokeWidth={1.5} />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-secondary">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
