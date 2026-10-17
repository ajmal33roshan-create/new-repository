'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * A reusable parallax scroll image.
 * The image drifts vertically as the user scrolls, creating depth.
 * Uses framer-motion useScroll scoped to the element's own position.
 */
export default function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority,
  offset = 60, // px of parallax travel
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}px`, `${offset}px`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover', imgClassName)}
        />
      </motion.div>
    </div>
  );
}
