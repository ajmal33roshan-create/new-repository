'use client';

import Link from 'next/link';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

const categoryLinks = [
  { href: '/properties?propertyType=VILLA', label: 'Luxury Villas' },
  { href: '/properties?propertyType=APARTMENT', label: 'Apartments' },
  { href: '/properties?propertyType=HOUSE', label: 'Family Homes' },
  { href: '/properties?propertyType=PENTHOUSE', label: 'Penthouses' },
  { href: '/properties?propertyType=COMMERCIAL', label: 'Commercial' },
];

export default function Footer() {
  return (
    <footer className="bg-beige">
      <div className="container-x py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
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
            <p className="mt-4 text-sm leading-relaxed text-secondary">
              Discover exceptional homes, prime locations, and lifestyle-driven communities — all in one place.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy transition-all hover:bg-navy hover:text-white"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-navy">Quick Links</h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-secondary transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-navy">Categories</h4>
            <ul className="mt-4 space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-secondary transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-navy">Get in Touch</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-secondary">
                <Phone className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <span>[Add your phone number]</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-secondary">
                <Mail className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <span>[Add your email address]</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-secondary">
                <MapPin className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <span>[Add your office address]</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy/10 pt-6 sm:flex-row">
          <p className="text-xs text-secondary">
            © {new Date().getFullYear()} Everlight Homes. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-secondary">
            <Link href="#" className="transition-colors hover:text-gold">Privacy Policy</Link>
            <span className="text-navy/20">|</span>
            <Link href="#" className="transition-colors hover:text-gold">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
