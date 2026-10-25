import type { Metadata } from "next";
import "../globals.css";
import { locales, type Locale, getDictionary } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  // Site-wide defaults only: canonical/hreflang and og:url are set per page, so a page
  // that forgets them doesn't inherit the homepage's canonical.
  const { alternates: _alternates, openGraph, ...home } = pageMetadata(lang, 'home');

  return {
    ...home,
    openGraph: { ...openGraph, url: undefined },
    metadataBase: new URL(SITE_URL),
    title: {
      default: (home.title as { absolute: string }).absolute,
      template: `%s | ${SITE_NAME}`,
    },
    keywords: ["naturopathe Montpellier", "naturopathie", "soins vibratoires", "soins énergétiques", "méditation", "chromobio-énergie", "reiki", "heilpraktikerin", "Montpellier"],
    authors: [{ name: "Valérie Heydlauf" }],
    creator: "Valérie Heydlauf",
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
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
}

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
