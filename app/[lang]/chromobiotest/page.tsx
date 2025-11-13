import { getDictionary, type Locale } from '@/lib/i18n';
import ChromobioTest from '@/components/ChromobioTest';

export default async function ChromobioTestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <ChromobioTest dictionary={dictionary.chromobiotest as any} lang={lang} />;
}
