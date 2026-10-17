'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ParallaxImage from './ParallaxImage';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.6]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-navy via-navy-light to-navy py-16 lg:py-24">
        {/* Background image — parallax */}
        <div className="absolute inset-0 opacity-20">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="h-full w-full"
            sizes="100vw"
            offset={50}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="container-x relative z-10 text-center"
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
            Explore exceptional properties and take the next step toward your dream home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/signup" className="btn-gold group">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/properties" className="btn-outline border-white/30 text-white hover:bg-white hover:text-navy">
              Explore Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
