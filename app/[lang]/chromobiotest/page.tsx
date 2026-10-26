import { getDictionary, type Locale } from '@/lib/i18n';
import ChromobioTestWrapper from '@/components/ChromobioTestWrapper';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    fr: {
      title: 'Chromobio Test - Découvrez votre profil énergétique | Cœur de l\'OM',
      description: 'Test gratuit de Chromobioénergétique en ligne. Découvrez votre spectre de couleurs et votre profil énergétique. Accessible une fois par mois pour suivre votre évolution.',
      keywords: ['chromobioénergie', 'test énergétique', 'profil couleurs', 'bien-être', 'énergie vitale', 'chromobio test', 'couleurs énergétiques'],
    },
    de: {
      title: 'Chromobio Test - Entdecken Sie Ihr energetisches Profil | Cœur de l\'OM',
      description: 'Kostenloser Online-Chromobioenergetik-Test. Entdecken Sie Ihr Farbspektrum und Ihr energetisches Profil. Einmal im Monat zugänglich.',
      keywords: ['Chromobioenergie', 'Energietest', 'Farbprofil', 'Wohlbefinden', 'Lebensenergie', 'Chromobio Test'],
    },
    en: {
      title: 'Chromobio Test - Discover Your Energetic Profile | Cœur de l\'OM',
      description: 'Free online Chromobioenergetics test. Discover your color spectrum and energetic profile. Accessible once a month to track your evolution.',
      keywords: ['chromobioenergy', 'energy test', 'color profile', 'wellbeing', 'vital energy', 'chromobio test'],
    },
  };

  const langMeta = metadata[lang as keyof typeof metadata] || metadata.fr;

  return {
    title: langMeta.title,
    description: langMeta.description,
    keywords: langMeta.keywords,
    openGraph: {
      title: langMeta.title,
      description: langMeta.description,
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
      type: 'website',
    },
    alternates: {
      canonical: `https://coeurdelom.fr/${lang}/chromobiotest`,
      languages: {
        'fr': 'https://coeurdelom.fr/fr/chromobiotest',
        'de': 'https://coeurdelom.fr/de/chromobiotest',
        'en': 'https://coeurdelom.fr/en/chromobiotest',
      },
    },
  };
}

export default async function ChromobioTestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <ChromobioTestWrapper
      lang={lang as Locale}
      preTestDict={dictionary.chromobioPretest as any}
      testDict={dictionary.chromobiotest as any}
    />
  );
}
