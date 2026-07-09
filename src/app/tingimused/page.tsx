import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalBlocks, { type Block } from "@/components/legal/LegalBlocks";
import { getI18n } from "@/lib/i18n/server";
import { legalVars } from "@/lib/company";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.legal.terms.title, description: dict.legal.terms.intro };
}

export default async function TermsPage() {
  const { dict, locale } = await getI18n();
  const p = dict.legal.terms;
  return (
    <LegalLayout dict={dict} locale={locale} title={p.title} intro={p.intro}>
      <LegalBlocks blocks={p.blocks as Block[]} vars={legalVars} />
    </LegalLayout>
  );
}
