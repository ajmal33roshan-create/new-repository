import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-script', display: 'swap' });

export const metadata = {
  title: 'Everlight Homes | Buy. Sell. Rent. Premium Real Estate',
  description: 'Discover exceptional homes, prime locations, and lifestyle-driven communities — all in one place. Premium properties for sale and rent.',
  keywords: ['real estate', 'luxury homes', 'properties for sale', 'properties for rent', 'villas', 'apartments'],
  openGraph: {
    title: 'Everlight Homes | Buy. Sell. Rent.',
    description: 'Discover exceptional homes, prime locations, and lifestyle-driven communities.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dancingScript.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
