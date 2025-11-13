import { getDictionary } from '@/lib/i18n';
import ChromobioTest from '@/components/ChromobioTest';

export default async function ChromobioTestPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);

  return <ChromobioTest dictionary={dictionary.chromobiotest} />;
}
