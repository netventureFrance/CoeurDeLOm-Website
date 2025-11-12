import type { Metadata } from "next";
import "../globals.css";
import { locales, type Locale, getDictionary } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Coeur de l'OM",
  description: "Bien-être, méditation et spiritualité",
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
        <link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header lang={lang as Locale} dict={dict} />
        {children}
        <Footer lang={lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
