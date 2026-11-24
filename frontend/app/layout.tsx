import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/site';

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
    default: `${SITE_NAME}: Environmental Prediction for India`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `${SITE_NAME} tracks deforestation trends, reforestation suitability, carbon footprints, and waterlogging risk for Indian cities using public records and transparent models.`,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME}: Environmental Prediction for India`,
    description:
      'Four environmental modules: Deforestation Tracker, Reforestation Planner, Carbon Footprint Calculator and Waterlogging Predictor.',
    images: [
      {
        url: `${SITE_URL}/images/deforestation.jpg`,
        width: 1200,
        height: 630,
        alt: `Deforested hillside: ${SITE_NAME} environmental prediction platform`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME}: Environmental Prediction for India`,
    description: 'Deforestation, Reforestation, Carbon and Waterlogging in one open platform.',
    images: [`${SITE_URL}/images/deforestation.jpg`],
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
