'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Heart, User, Menu, X, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/properties?listingType=SALE', label: 'Buy' },
  { href: '/properties?listingType=RENT', label: 'Rent' },
  { href: '/list-property', label: 'Sell Property' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    const base = href.split('?')[0];
    return pathname === base;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white/95 shadow-nav backdrop-blur-md' : 'bg-white'
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy">
            <Home className="h-5 w-5 text-gold" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="block text-lg font-bold text-navy">Everlight Homes</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Buy · Sell · Rent
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(link.href) ? 'text-navy' : 'text-secondary hover:text-navy'
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gold" />
              )}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-beige sm:flex"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </Link>
          {session ? (
            <Link href="/dashboard" className="hidden h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-beige sm:flex" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link href="/auth/login" className="hidden h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-beige sm:flex" aria-label="Login">
              <User className="h-5 w-5" />
            </Link>
          )}
          <Link href={session ? '/dashboard' : '/auth/signup'} className="btn-primary hidden sm:inline-flex">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-beige xl:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-navy/5 bg-white xl:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive(link.href) ? 'bg-beige text-navy' : 'text-secondary hover:bg-beige'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-navy/5 pt-4">
              <Link href="/dashboard" className="btn-outline flex-1">
                <Heart className="h-4 w-4" /> Favorites
              </Link>
              <Link href={session ? '/dashboard' : '/auth/signup'} className="btn-primary flex-1">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
