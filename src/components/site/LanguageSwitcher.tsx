"use client";

import { useRouter } from "next/navigation";
import { locales, LANG_COOKIE, type Locale } from "@/lib/i18n/dictionaries";
import { cx } from "@/lib/format";

export default function LanguageSwitcher({
  current,
  className,
}: {
  current: Locale;
  className?: string;
}) {
  const router = useRouter();

  const set = (l: Locale) => {
    if (l === current) return;
    // 1 year cookie
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  };

  return (
    <div className={cx("flex items-center gap-1", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-1 text-cream/25">·</span>}
          <button
            onClick={() => set(l)}
            aria-current={l === current}
            className={cx(
              "font-sans text-[0.64rem] uppercase tracking-luxe transition-colors",
              l === current ? "text-gold" : "text-cream/45 hover:text-cream"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
