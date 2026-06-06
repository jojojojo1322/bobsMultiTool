import { redirect } from "next/navigation";
import { defaultLocale, isLocale, withLocale } from "@/features/i18n/config";

export default async function LocalizedToolsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) redirect("/tools/regex-tester");
  redirect(withLocale("/tools/regex-tester", locale));
}
