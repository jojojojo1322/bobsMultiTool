import { defaultLocale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { readSearchQuery, ToolDirectory } from "@/features/tools/tool-directory";

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const dictionary = getClientDictionary(defaultLocale);
  const initialQuery = readSearchQuery(await searchParams);

  return <ToolDirectory locale={defaultLocale} dictionary={dictionary} initialQuery={initialQuery} />;
}
