"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/hooks";
import { formatPrice } from "@/lib/format";
import { shippingCentsFor } from "@/lib/shipping";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type Status = "idle" | "submitting" | "success" | "error";

interface Bank {
  code: string;
  name: string;
}
interface Carrier {
  code: string;
  name: string;
}
interface PickupPoint {
  id: string;
  name: string;
  address?: string;
  city?: string;
}

export default function CheckoutClient({
  montonioConfigured,
  banks,
  carriers,
  dict,
  locale,
}: {
  montonioConfigured: boolean;
  banks: Bank[];
  carriers: Carrier[];
  dict: Dictionary;
  locale: Locale;
}) {
  const c = dict.checkout;
  const cart = dict.cart;
  const hydrated = useHydrated();
  const { lines, subtotalCents, clear, setQty, remove } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryMethod: "pickup",
    pickupText: "",
    comments: "",
  });

  const [bank, setBank] = useState<string>("");
  const [carrier, setCarrier] = useState<string>(carriers[0]?.code ?? "omniva");
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [pointId, setPointId] = useState<string>("");
  const [loadingPoints, setLoadingPoints] = useState(false);

  const subtotal = hydrated ? subtotalCents() : 0;
  const shipping = shippingCentsFor(form.deliveryMethod);
  const total = subtotal + shipping;
  const isPickup = form.deliveryMethod === "pickup";

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!montonioConfigured || !isPickup) return;
    let active = true;
    setLoadingPoints(true);
    setPoints([]);
    setPointId("");
    fetch(`/api/shipping/pickup-points?carrier=${carrier}&country=EE`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setPoints(d.points ?? []);
      })
      .catch(() => active && setPoints([]))
      .finally(() => active && setLoadingPoints(false));
    return () => {
      active = false;
    };
  }, [carrier, isPickup, montonioConfigured]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (montonioConfigured && !bank) {
      setError(c.chooseBank);
      return;
    }
    if (montonioConfigured && isPickup && points.length > 0 && !pointId) {
      setError(c.choosePoint);
      return;
    }
    if (!montonioConfigured && isPickup && !form.pickupText.trim()) {
      setError(c.enterPoint);
      return;
    }

    setStatus("submitting");
    const selectedPoint = points.find((p) => p.id === pointId);
    const pickupName = montonioConfigured
      ? selectedPoint?.name
      : isPickup
        ? form.pickupText.trim()
        : undefined;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          provider: bank || undefined,
          shippingCarrier: montonioConfigured && isPickup ? carrier : undefined,
          pickupPointId: montonioConfigured ? selectedPoint?.id : undefined,
          pickupPointName: pickupName,
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? c.error);
        setStatus("error");
        return;
      }
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      setReference(data.reference);
      setStatus("success");
      clear();
    } catch {
      setError(c.connError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-ink px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg text-center"
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-2xl text-gold">
            ✓
          </span>
          <h1 className="display mt-8 text-[clamp(2rem,5vw,3.2rem)] text-cream">
            {c.successTitle}
          </h1>
          <p className="mt-5 font-sans text-[0.95rem] leading-relaxed text-cream/60">
            {c.successBody}
          </p>
          <p className="mt-3 font-serif text-3xl italic text-gold">{reference}</p>
          <Link href="/" className="btn-ghost mt-10 inline-flex">
            {c.back}
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-ink px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="link-underline font-sans text-[0.66rem] uppercase tracking-luxe text-cream/50"
          >
            ← {c.back}
          </Link>
          <LanguageSwitcher current={locale} />
        </div>

        <h1 className="display mt-8 text-[clamp(2.4rem,6vw,4rem)] text-cream">{c.title}</h1>
        <p className="mt-4 max-w-lg font-sans text-[0.92rem] leading-relaxed text-cream/55">
          {montonioConfigured ? c.subtitleMontonio : c.subtitleDemo}
        </p>

        {hydrated && lines.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-cream/10 bg-ink-soft p-12 text-center">
            <p className="font-serif text-2xl text-cream/70">{cart.empty}</p>
            <Link href="/#pood" className="btn-gold mt-8 inline-flex">
              {cart.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={submit} className="space-y-6">
              <Field label={c.fields.name} value={form.name} onChange={(v) => update("name", v)} required autoComplete="name" />
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={c.fields.email} type="email" value={form.email} onChange={(v) => update("email", v)} required autoComplete="email" />
                <Field label={c.fields.phone} type="tel" value={form.phone} onChange={(v) => update("phone", v)} required autoComplete="tel" />
              </div>

              {/* Delivery */}
              <div>
                <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
                  {c.fields.delivery}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["pickup", "store"] as const).map((k) => (
                    <button
                      type="button"
                      key={k}
                      onClick={() => update("deliveryMethod", k)}
                      className={`rounded-xl border px-4 py-4 text-left font-sans text-[0.72rem] uppercase tracking-luxe transition-colors ${
                        form.deliveryMethod === k
                          ? "border-gold text-gold"
                          : "border-cream/15 text-cream/60 hover:border-cream/40"
                      }`}
                    >
                      {c.delivery[k]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parcel machine picker */}
              {montonioConfigured && isPickup && (
                <div className="grid gap-4 rounded-xl border border-cream/10 bg-ink-soft p-5">
                  <div>
                    <label className="mb-2 block font-sans text-[0.6rem] uppercase tracking-luxe text-cream/50">
                      {c.carrier}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {carriers.map((ca) => (
                        <button
                          type="button"
                          key={ca.code}
                          onClick={() => setCarrier(ca.code)}
                          className={`rounded-full border px-4 py-2 font-sans text-[0.64rem] uppercase tracking-luxe transition-colors ${
                            carrier === ca.code
                              ? "border-gold text-gold"
                              : "border-cream/15 text-cream/60 hover:border-cream/40"
                          }`}
                        >
                          {ca.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-sans text-[0.6rem] uppercase tracking-luxe text-cream/50">
                      {c.pickupPoint}
                    </label>
                    {loadingPoints ? (
                      <p className="text-sm text-cream/40">{c.loadingPoints}</p>
                    ) : points.length > 0 ? (
                      <select
                        value={pointId}
                        onChange={(e) => setPointId(e.target.value)}
                        className="w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 font-sans text-sm text-cream outline-none focus:border-gold"
                      >
                        <option value="">{c.selectPoint}</option>
                        {points.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                            {p.city ? ` · ${p.city}` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-cream/40">{c.noPoints}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Free-text parcel machine (invoice mode) */}
              {!montonioConfigured && isPickup && (
                <div>
                  <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
                    {c.pickupPoint} <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.pickupText}
                    onChange={(e) => update("pickupText", e.target.value)}
                    placeholder={c.pickupPlaceholder}
                    className="w-full rounded-xl border border-cream/15 bg-ink-soft px-4 py-3 font-sans text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                  />
                </div>
              )}

              {/* Payment method — invoice (Montonio paused) */}
              {!montonioConfigured && (
                <div>
                  <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
                    {c.paymentTitle}
                  </label>
                  <div className="rounded-xl border border-gold/40 bg-cream/[0.03] px-5 py-4">
                    <p className="font-sans text-[0.8rem] uppercase tracking-luxe text-gold">
                      {c.invoiceOption}
                    </p>
                    <p className="mt-2 font-sans text-[0.85rem] leading-relaxed text-cream/60">
                      {c.invoiceNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Bank links */}
              {montonioConfigured && (
                <div>
                  <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
                    {c.payLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {banks.map((b) => (
                      <button
                        type="button"
                        key={b.code}
                        onClick={() => setBank(b.code)}
                        className={`rounded-xl border px-4 py-4 font-sans text-[0.72rem] uppercase tracking-luxe transition-colors ${
                          bank === b.code
                            ? "border-gold text-gold"
                            : "border-cream/15 text-cream/70 hover:border-cream/40"
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
                  {c.fields.comments}
                </label>
                <textarea
                  value={form.comments}
                  onChange={(e) => update("comments", e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-cream/15 bg-ink-soft px-4 py-3 font-sans text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
                  placeholder={c.commentsPlaceholder}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-amber-glow/40 bg-amber-glow/10 px-4 py-3 font-sans text-sm text-amber-glow">
                  {error}
                </p>
              )}

              <button type="submit" disabled={status === "submitting"} className="btn-gold w-full">
                {status === "submitting"
                  ? c.placing
                  : montonioConfigured
                    ? `${c.pay} — ${formatPrice(total)}`
                    : c.place}
              </button>

              {montonioConfigured && (
                <p className="text-center text-[0.6rem] uppercase tracking-luxe text-cream/35">
                  {c.secureNote}
                </p>
              )}
            </form>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-cream/10 bg-ink-soft p-7 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl text-cream">{c.summary}</h2>
              <div className="mt-6 space-y-5">
                {hydrated &&
                  lines.map((l) => (
                    <div key={l.slug} className="flex gap-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                        <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-center gap-2">
                        <p className="font-serif text-lg leading-tight text-cream">{l.name}</p>
                        <p className="text-[0.6rem] uppercase tracking-luxe text-cream/45">
                          {l.volume}
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                          <div className="flex items-center gap-3 rounded-full border border-cream/20 px-3 py-1">
                            <button
                              type="button"
                              onClick={() => setQty(l.slug, l.quantity - 1)}
                              className="text-cream/70 transition-colors hover:text-gold"
                              aria-label={cart.less}
                            >
                              −
                            </button>
                            <span className="min-w-4 text-center text-xs text-cream">{l.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQty(l.slug, l.quantity + 1)}
                              className="text-cream/70 transition-colors hover:text-gold"
                              aria-label={cart.more}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(l.slug)}
                            className="text-[0.58rem] uppercase tracking-luxe text-cream/35 transition-colors hover:text-amber-glow"
                          >
                            {cart.remove}
                          </button>
                        </div>
                      </div>
                      <p className="self-start whitespace-nowrap font-sans text-sm text-gold">
                        {formatPrice(l.priceCents * l.quantity)}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-7 space-y-2 border-t border-cream/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] uppercase tracking-luxe text-cream/55">{cart.subtotal}</span>
                  <span className="font-sans text-sm text-cream/80">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] uppercase tracking-luxe text-cream/55">
                    {c.shipping} · {c.delivery[form.deliveryMethod as "pickup" | "store"]}
                  </span>
                  <span className="font-sans text-sm text-cream/80">
                    {shipping === 0 ? c.free : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[0.72rem] uppercase tracking-luxe text-cream/70">{c.total}</span>
                  <span className="font-serif text-2xl text-cream">{formatPrice(total)}</span>
                </div>
              </div>
              <p className="mt-4 text-center text-[0.62rem] uppercase tracking-luxe text-cream/40">
                {montonioConfigured ? c.secureNote : c.invoiceOption}
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-cream/15 bg-ink-soft px-4 py-3 font-sans text-sm text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold"
      />
    </div>
  );
}
