import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalBlocks, { type Block } from "@/components/legal/LegalBlocks";
import { getI18n } from "@/lib/i18n/server";
import { legalVars } from "@/lib/company";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.legal.privacy.title, description: dict.legal.privacy.intro };
}

export default async function PrivacyPage() {
  const { dict, locale } = await getI18n();
  const p = dict.legal.privacy;
  return (
    <LegalLayout dict={dict} locale={locale} title={p.title} intro={p.intro}>
      <LegalBlocks blocks={p.blocks as Block[]} vars={legalVars} />
    </LegalLayout>
  );
}
