import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { company } from "@/lib/company";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function Footer({ dict }: { dict: Dictionary }) {
  const t = dict.footer;
  return (
    <footer className="border-t border-cream/10 bg-ink py-16">
      <div className="container-luxe">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto text-gold" />
              <span className="font-sans text-[0.66rem] uppercase tracking-luxe text-cream/80">
                Aura &amp; Ood
              </span>
            </div>
            <p className="mt-5 max-w-xs font-serif text-xl italic leading-snug text-cream/60">
              {t.tagline}
            </p>
          </div>

          {/* Info links */}
          <div>
            <p className="mb-4 font-sans text-[0.58rem] uppercase tracking-luxe text-cream/40">
              {t.infoLabel}
            </p>
            <ul className="space-y-2.5">
              {dict.legal.nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline font-sans text-[0.82rem] text-cream/70 hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 font-sans text-[0.58rem] uppercase tracking-luxe text-cream/40">
              {t.contactLabel}
            </p>
            <div className="space-y-1.5 font-sans text-[0.82rem] text-cream/70">
              <a href={`mailto:${company.email}`} className="link-underline block hover:text-gold">
                {company.email}
              </a>
              <p>{company.phone}</p>
              <p className="pt-2 text-cream/45">{company.legalName}</p>
              <p className="text-cream/45">Reg. {company.regNr}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[0.62rem] uppercase tracking-luxe text-cream/35 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {company.legalName}. {t.rights}
          </span>
          <span>Morning Spirit · Koidiku Kaja</span>
        </div>
      </div>
    </footer>
  );
}
