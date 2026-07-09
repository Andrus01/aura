import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { renderInline } from "@/components/legal/LegalBlocks";
import { getI18n } from "@/lib/i18n/server";
import { legalVars } from "@/lib/company";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.legal.faq.title, description: dict.legal.faq.intro };
}

export default async function FaqPage() {
  const { dict, locale } = await getI18n();
  const p = dict.legal.faq;

  return (
    <LegalLayout dict={dict} locale={locale} title={p.title} intro={p.intro}>
      {p.items.map((item, i) => (
        <div key={i}>
          <h3>{item.q}</h3>
          <p>{renderInline(item.a, legalVars)}</p>
        </div>
      ))}
    </LegalLayout>
  );
}
