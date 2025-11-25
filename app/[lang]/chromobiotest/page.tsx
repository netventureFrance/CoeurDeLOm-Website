import { getDictionary, type Locale } from '@/lib/i18n';
import ChromobioTestWrapper from '@/components/ChromobioTestWrapper';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return {
    title: 'Test ChromoBioÉnergétique - Découvrez votre profil énergétique',
    description: 'Test rapide de Chromobioénergétique pour découvrir votre profil énergétique et vos couleurs dominantes.',
    keywords: ['chromobioénergie', 'test énergétique', 'profil couleurs', 'bien-être', 'énergie vitale'],
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
