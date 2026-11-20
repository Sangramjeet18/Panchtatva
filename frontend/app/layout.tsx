import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoSense: Environmental Prediction for India',
    template: '%s | EcoSense',
  },
  description:
    'EcoSense tracks deforestation trends, reforestation suitability, carbon footprints, and waterlogging risk for Indian cities using public records and transparent models.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ecosense.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'EcoSense',
    title: 'EcoSense: Environmental Prediction for India',
    description:
      'Four environmental modules: Deforestation Tracker, Reforestation Planner, Carbon Footprint Calculator and Waterlogging Predictor.',
    images: [
      {
        url: '/images/deforestation.jpg',
        width: 1200,
        height: 630,
        alt: 'Deforested hillside: EcoSense environmental prediction platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoSense: Environmental Prediction for India',
    description: 'Deforestation, Reforestation, Carbon and Waterlogging in one open platform.',
    images: ['/images/deforestation.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
