import { getDictionary, type Locale } from "@/lib/i18n";
import HeroSection from "@/components/HeroSection";
import OfficeCarousel from "@/components/OfficeCarousel";
import NewsPromo from "@/components/NewsPromo";
import { getNewsPromos } from "@/lib/airtable";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, "home");
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const home = dict.home as any;

  // Fetch news/promos from Airtable
  const newsPromos = await getNewsPromos(lang);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Interactive Effects */}
      <HeroSection subtitle={home.subtitle} h1Tagline={home.h1Tagline} intro={home.intro} />

      {/* Office Gallery Carousel */}
      <OfficeCarousel alts={home.galleryAlts} />

      {/* News & Promos Section */}
      <NewsPromo initialNews={newsPromos} />
    </main>
  );
}
