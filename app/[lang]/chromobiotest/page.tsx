import { getDictionary, type Locale } from '@/lib/i18n';
import ChromobioTestWrapper from '@/components/ChromobioTestWrapper';
import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, 'chromobiotest');
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
