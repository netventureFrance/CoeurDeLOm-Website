import type { Metadata } from "next";
import "../globals.css";
import { locales, type Locale, getDictionary } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://coeurdelom.fr'),
  title: {
    default: "Cœur de l'OM - Naturopathie, Soins Vibratoires & Méditation",
    template: "%s | Cœur de l'OM"
  },
  description: "Découvrez l'efficacité des soins vibratoires, naturopathie et méditation avec Valérie Heydlauf. Heilpraktikerin diplômée, spécialisée en Chromobio-Énergie. Cabinet en France.",
  keywords: ["naturopathie", "soins vibratoires", "méditation", "chromobio-énergie", "reiki", "bien-être", "spiritualité", "thérapies douces", "heilpraktikerin", "énergétique"],
  authors: [{ name: "Valérie Heydlauf" }],
  creator: "Valérie Heydlauf",
  publisher: "Cœur de l'OM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['de_DE', 'en_US'],
    url: 'https://coeurdelom.fr',
    siteName: "Cœur de l'OM",
    title: "Cœur de l'OM - Naturopathie, Soins Vibratoires & Méditation",
    description: "Découvrez l'efficacité des soins vibratoires, naturopathie et méditation avec Valérie Heydlauf. Heilpraktikerin diplômée, spécialisée en Chromobio-Énergie.",
    images: [
      {
        url: '/Coeur-de-lOm-Alpha-Kopie.png',
        width: 1200,
        height: 630,
        alt: "Cœur de l'OM - Naturopathie et Soins Énergétiques",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cœur de l'OM - Naturopathie, Soins Vibratoires & Méditation",
    description: "Découvrez l'efficacité des soins vibratoires, naturopathie et méditation avec Valérie Heydlauf.",
    images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '', // Add your Google Search Console verification code here
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <StructuredData />
      </head>
      <body>
        <Header lang={lang as Locale} dict={dict} />
        {children}
        <Footer lang={lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
