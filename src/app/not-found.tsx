import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-beige px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-navy">
        <Home className="h-10 w-5 text-gold" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6 text-6xl font-bold text-navy">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-navy">Page Not Found</h2>
      <p className="mt-3 max-w-md text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back home.
      </p>
      <Link href="/" className="btn-primary mt-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
