"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/hooks";
import { formatPrice } from "@/lib/format";
import { content } from "@/lib/content";
import { shippingCentsFor } from "@/lib/shipping";

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
}: {
  montonioConfigured: boolean;
  banks: Bank[];
  carriers: Carrier[];
}) {
  const hydrated = useHydrated();
  const { lines, subtotalCents, clear } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryMethod: "pickup",
    comments: "",
  });

  // Montonio state
  const [bank, setBank] = useState<string>("");
  const [carrier, setCarrier] = useState<string>(carriers[0]?.code ?? "omniva");
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [pointId, setPointId] = useState<string>("");
  const [loadingPoints, setLoadingPoints] = useState(false);

  const subtotal = hydrated ? subtotalCents() : 0;
  const shipping = shippingCentsFor(form.deliveryMethod);
  const total = subtotal + shipping;
  const c = content.checkout;
  const isPickup = form.deliveryMethod === "pickup";

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Fetch pickup points when carrier changes (only in pickup mode + configured)
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
      setError("Palun vali pank.");
      return;
    }
    if (montonioConfigured && isPickup && points.length > 0 && !pointId) {
      setError("Palun vali pakiautomaat.");
      return;
    }

    setStatus("submitting");
    const selectedPoint = points.find((p) => p.id === pointId);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          provider: bank || undefined,
          shippingCarrier: isPickup ? carrier : undefined,
          pickupPointId: selectedPoint?.id,
          pickupPointName: selectedPoint?.name,
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Midagi läks valesti.");
        setStatus("error");
        return;
      }
      // Montonio: redirect to hosted bank-link payment
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      // Demo mode
      setReference(data.reference);
      setStatus("success");
      clear();
    } catch {
      setError("Ühenduse viga. Proovi uuesti.");
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
        <Link
          href="/"
          className="link-underline font-sans text-[0.66rem] uppercase tracking-luxe text-cream/50"
        >
          ← {c.back}
        </Link>

        <h1 className="display mt-8 text-[clamp(2.4rem,6vw,4rem)] text-cream">{c.title}</h1>
        <p className="mt-4 max-w-lg font-sans text-[0.92rem] leading-relaxed text-cream/55">
          {montonioConfigured
            ? "Turvaline makse Montonio pangalingi kaudu. Vali pank ja tarneviis."
            : c.subtitle}
        </p>

        {hydrated && lines.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-cream/10 bg-ink-soft p-12 text-center">
            <p className="font-serif text-2xl text-cream/70">{content.cart.empty}</p>
            <Link href="/#pood" className="btn-gold mt-8 inline-flex">
              {content.cart.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={submit} className="space-y-6">
              <Field
                label={c.fields.name}
                value={form.name}
                onChange={(v) => update("name", v)}
                required
                autoComplete="name"
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label={c.fields.email}
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  required
                  autoComplete="email"
                />
                <Field
                  label={c.fields.phone}
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  required
                  autoComplete="tel"
                />
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
                      Vedaja
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
                      Pakiautomaat
                    </label>
                    {loadingPoints ? (
                      <p className="text-sm text-cream/40">Laen pakiautomaate…</p>
                    ) : points.length > 0 ? (
                      <select
                        value={pointId}
                        onChange={(e) => setPointId(e.target.value)}
                        className="w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 font-sans text-sm text-cream outline-none focus:border-gold"
                      >
                        <option value="">— Vali pakiautomaat —</option>
                        {points.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                            {p.city ? ` · ${p.city}` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-cream/40">
                        Sellel vedajal pole hetkel sandbox-keskkonnas pakiautomaate saadaval.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Bank links */}
              {montonioConfigured && (
                <div>
                  <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
                    Maksmine — pangalink
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
                  placeholder="Nt kättesaamise soovid…"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-amber-glow/40 bg-amber-glow/10 px-4 py-3 font-sans text-sm text-amber-glow">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-gold w-full"
              >
                {status === "submitting"
                  ? c.placing
                  : montonioConfigured
                    ? `Maksa — ${formatPrice(total)}`
                    : c.place}
              </button>

              {montonioConfigured && (
                <p className="text-center text-[0.6rem] uppercase tracking-luxe text-cream/35">
                  Montonio {montonioConfigured ? "sandbox" : ""} · turvaline pangalink
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
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="font-serif text-lg leading-tight text-cream">{l.name}</p>
                        <p className="text-[0.64rem] uppercase tracking-luxe text-cream/45">
                          {l.volume} · {content.shop.qty} {l.quantity}
                        </p>
                      </div>
                      <p className="self-center whitespace-nowrap font-sans text-sm text-gold">
                        {formatPrice(l.priceCents * l.quantity)}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-7 space-y-2 border-t border-cream/10 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] uppercase tracking-luxe text-cream/55">
                    {content.cart.subtotal}
                  </span>
                  <span className="font-sans text-sm text-cream/80">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] uppercase tracking-luxe text-cream/55">
                    Tarne · {c.delivery[form.deliveryMethod as "pickup" | "store"]}
                  </span>
                  <span className="font-sans text-sm text-cream/80">
                    {shipping === 0 ? "Tasuta" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[0.72rem] uppercase tracking-luxe text-cream/70">
                    Kokku
                  </span>
                  <span className="font-serif text-2xl text-cream">{formatPrice(total)}</span>
                </div>
              </div>
              <p className="mt-4 text-center text-[0.62rem] uppercase tracking-luxe text-cream/40">
                {montonioConfigured ? "Montonio sandbox · turvaline makse" : content.cart.note}
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
