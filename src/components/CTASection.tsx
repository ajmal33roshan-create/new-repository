import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-navy via-navy-light to-navy py-16 lg:py-24">
        {/* Background image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />

        <div className="container-x relative z-10 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
            Explore exceptional properties and take the next step toward your dream home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/signup" className="btn-gold">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/properties" className="btn-outline border-white/30 text-white hover:bg-white hover:text-navy">
              Explore Properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
