import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import { company } from "@/lib/company";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export default function LegalLayout({
  dict,
  locale,
  title,
  intro,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const t = dict.legal;
  return (
    <div className="min-h-[100svh] bg-ink">
      {/* Header */}
      <header className="border-b border-cream/10">
        <div className="container-luxe flex items-center justify-between gap-4 py-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Aura & Ood">
            <Logo className="h-7 w-auto text-gold" />
            <span className="font-sans text-[0.6rem] uppercase tracking-luxe text-cream/80">
              Aura &amp; Ood
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <LanguageSwitcher current={locale} />
            <Link
              href="/"
              className="font-sans text-[0.62rem] uppercase tracking-luxe text-cream/50 transition-colors hover:text-gold"
            >
              ← {t.back}
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="container-luxe grid gap-12 py-16 md:grid-cols-[220px_1fr] md:py-24">
        {/* Side nav */}
        <aside className="md:sticky md:top-24 md:h-fit">
          <p className="mb-4 font-sans text-[0.58rem] uppercase tracking-luxe text-cream/40">
            {t.infoLabel}
          </p>
          <nav className="flex flex-col gap-1">
            {t.nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 font-sans text-[0.8rem] text-cream/65 transition-colors hover:bg-cream/[0.04] hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div>
          <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] text-cream">{title}</h1>
          {intro && (
            <p className="mt-4 max-w-2xl font-sans text-[1rem] leading-relaxed text-cream/60">
              {intro}
            </p>
          )}
          <p className="mt-4 font-sans text-[0.62rem] uppercase tracking-luxe text-cream/35">
            {t.updatedLabel} {company.legalUpdated}
          </p>

          <article className="legal mt-10 max-w-2xl">{children}</article>

          <div className="mt-16 border-t border-cream/10 pt-8">
            <p className="font-sans text-[0.8rem] leading-relaxed text-cream/50">
              {company.legalName} · {company.regNr} · {company.address}
              <br />
              {company.email} · {company.phone}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
