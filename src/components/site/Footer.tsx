import { content } from "@/lib/content";
import { Logo } from "@/components/site/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink py-16">
      <div className="container-luxe">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto text-gold" />
              <span className="font-sans text-[0.66rem] uppercase tracking-luxe text-cream/80">
                Aura &amp; Ood
              </span>
            </div>
            <p className="mt-5 max-w-xs font-serif text-xl italic leading-snug text-cream/60">
              {content.footer.tagline}
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="font-sans text-[0.62rem] uppercase tracking-wideluxe text-gold/70">
              {content.footer.madeIn}
            </p>
            <a
              href="https://auraood.ee"
              className="link-underline mt-3 inline-block font-sans text-sm text-cream/80"
            >
              {content.domain}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[0.62rem] uppercase tracking-luxe text-cream/35 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} Aura &amp; Ood. {content.footer.rights}
          </span>
          <span>Morning Spirit · Koidiku Kaja</span>
        </div>
      </div>
    </footer>
  );
}
