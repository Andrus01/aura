"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/lib/types";
import type { AdminOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { Logo } from "@/components/site/Logo";

type Tab = "products" | "orders";

export default function AdminDashboard({
  products,
  orders,
}: {
  products: Product[];
  orders: AdminOrder[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const revenue = orders.reduce((s, o) => s + o.subtotalCents + o.shippingCents, 0);

  return (
    <main className="min-h-[100svh] bg-ink px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-auto text-gold" />
            <span className="font-sans text-[0.62rem] uppercase tracking-luxe text-cream/70">
              Aura &amp; Ood · Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50 hover:text-gold"
            >
              Vaata poodi ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-cream/20 px-4 py-2 font-sans text-[0.62rem] uppercase tracking-luxe text-cream/70 hover:border-gold hover:text-gold"
            >
              Logi välja
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Tooteid" value={String(products.length)} />
          <Stat label="Tellimusi" value={String(orders.length)} />
          <Stat label="Käive (demo)" value={formatPrice(revenue)} />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-2 border-b border-cream/10">
          <TabButton active={tab === "products"} onClick={() => setTab("products")}>
            Tooted
          </TabButton>
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
            Tellimused
          </TabButton>
        </div>

        <div className="mt-8">
          {tab === "products" ? (
            <div className="space-y-4">
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <OrdersView orders={orders} />
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cream/10 bg-ink-soft p-5">
      <p className="font-sans text-[0.6rem] uppercase tracking-luxe text-cream/45">{label}</p>
      <p className="mt-2 font-serif text-3xl text-cream">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-3 font-sans text-[0.68rem] uppercase tracking-luxe transition-colors ${
        active ? "border-gold text-gold" : "border-transparent text-cream/50 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function ProductRow({ product }: { product: Product }) {
  const [price, setPrice] = useState((product.priceCents / 100).toFixed(2));
  const [stock, setStock] = useState(String(product.stock));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const dirty =
    Math.round(parseFloat(price) * 100) !== product.priceCents ||
    parseInt(stock, 10) !== product.stock;

  async function save() {
    setState("saving");
    setMsg("");
    const priceCents = Math.round(parseFloat(price.replace(",", ".")) * 100);
    const stockNum = parseInt(stock, 10);
    if (Number.isNaN(priceCents) || Number.isNaN(stockNum)) {
      setState("error");
      setMsg("Vigane väärtus.");
      return;
    }
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, priceCents, stock: stockNum }),
      });
      if (!res.ok) {
        const d = await res.json();
        setState("error");
        setMsg(d.error ?? "Salvestamine ebaõnnestus.");
        return;
      }
      setState("saved");
      setMsg("Salvestatud ✓");
      // reset the "baseline" so button disables again
      product.priceCents = priceCents;
      product.stock = stockNum;
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      setMsg("Ühenduse viga.");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-cream/10 bg-ink-soft p-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {primary && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary.url}
            alt={product.name}
            className="h-16 w-14 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-serif text-xl text-cream">{product.name}</p>
          <p className="font-sans text-[0.62rem] uppercase tracking-luxe text-cream/45">
            {product.volume} · {product.slug}
          </p>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[0.56rem] uppercase tracking-luxe text-cream/45">
            Hind (€)
          </span>
          <input
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 rounded-lg border border-cream/15 bg-ink px-3 py-2 font-sans text-sm text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[0.56rem] uppercase tracking-luxe text-cream/45">
            Laoseis
          </span>
          <input
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-20 rounded-lg border border-cream/15 bg-ink px-3 py-2 font-sans text-sm text-cream outline-none focus:border-gold"
          />
        </label>
        <button
          onClick={save}
          disabled={!dirty || state === "saving"}
          className="btn-gold px-6 py-2.5 text-[0.62rem] disabled:opacity-40"
        >
          {state === "saving" ? "…" : "Salvesta"}
        </button>
      </div>

      {msg && (
        <span
          className={`font-sans text-[0.62rem] uppercase tracking-luxe ${
            state === "error" ? "text-amber-glow" : "text-gold"
          }`}
        >
          {msg}
        </span>
      )}
    </div>
  );
}

function OrdersView({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-cream/10 bg-ink-soft p-10 text-center">
        <p className="font-serif text-2xl text-cream/60">Tellimusi veel pole.</p>
      </div>
    );
  }

  const deliveryLabel: Record<string, string> = {
    courier: "Kuller",
    pickup: "Pakiautomaat",
    store: "Tulen ise järele",
  };

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <details
          key={o.id}
          className="group rounded-xl border border-cream/10 bg-ink-soft p-5 open:border-gold/30"
        >
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 list-none">
            <div className="flex items-center gap-4">
              <span className="font-serif text-lg text-gold">{o.reference}</span>
              <span className="font-sans text-sm text-cream/70">{o.customerName}</span>
              <PaymentBadge status={o.paymentStatus} />
            </div>
            <div className="flex items-center gap-5">
              <span className="rounded-full border border-cream/15 px-3 py-1 font-sans text-[0.56rem] uppercase tracking-luxe text-cream/60">
                {deliveryLabel[o.deliveryMethod] ?? o.deliveryMethod}
              </span>
              <span className="font-serif text-xl text-cream">
                {formatPrice(o.subtotalCents + o.shippingCents)}
              </span>
              <span className="font-sans text-[0.6rem] uppercase tracking-luxe text-cream/40">
                {new Date(o.createdAt).toLocaleDateString("et-EE")}
              </span>
            </div>
          </summary>

          <div className="mt-5 grid gap-6 border-t border-cream/10 pt-5 sm:grid-cols-2">
            <div>
              <p className="mb-3 font-sans text-[0.56rem] uppercase tracking-luxe text-cream/40">
                Klient
              </p>
              <dl className="space-y-1.5 font-sans text-sm text-cream/80">
                <Row k="E-post" v={o.email} />
                <Row k="Telefon" v={o.phone} />
                <Row k="Tarne" v={deliveryLabel[o.deliveryMethod] ?? o.deliveryMethod} />
                {o.pickupPointName && (
                  <Row
                    k="Pakiautomaat"
                    v={`${o.shippingCarrier ?? ""} · ${o.pickupPointName}`}
                  />
                )}
                {o.comments && <Row k="Kommentaar" v={o.comments} />}
                <Row k="Makse" v={`${o.paymentMethod}${o.paymentProvider ? " · " + o.paymentProvider : ""} (${o.paymentStatus})`} />
                <Row k="Staatus" v={o.status} />
                {o.shipmentStatus && <Row k="Saadetis" v={o.shipmentStatus} />}
              </dl>
              {o.pickupPointId && (
                <ShipmentButton orderId={o.id} initial={o.shipmentStatus} />
              )}
            </div>
            <div>
              <p className="mb-3 font-sans text-[0.56rem] uppercase tracking-luxe text-cream/40">
                Tooted
              </p>
              <ul className="space-y-2">
                {o.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex justify-between font-sans text-sm text-cream/80"
                  >
                    <span>
                      {it.productName} · {it.volume} × {it.quantity}
                    </span>
                    <span className="text-gold">
                      {formatPrice(it.unitPriceCents * it.quantity)}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-cream/10 pt-2 font-sans text-sm text-cream/60">
                  <span>Tarne</span>
                  <span>{o.shippingCents === 0 ? "Tasuta" : formatPrice(o.shippingCents)}</span>
                </li>
                <li className="flex justify-between font-sans text-sm">
                  <span className="text-cream/80">Kokku</span>
                  <span className="font-serif text-lg text-cream">
                    {formatPrice(o.subtotalCents + o.shippingCents)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 shrink-0 text-cream/40">{k}</dt>
      <dd className="text-cream/85">{v}</dd>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const map: Record<string, { cls: string; label: string }> = {
    PAID: { cls: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300", label: "✓ Makstud" },
    PENDING: { cls: "border-cream/25 text-cream/60", label: "Makse ootel" },
    ABANDONED: { cls: "border-amber-glow/40 text-amber-glow", label: "Katkestatud" },
    PAYMENT_FAILED: { cls: "border-amber-glow/40 text-amber-glow", label: "Ebaõnnestus" },
    DEMO: { cls: "border-cream/15 text-cream/40", label: "Demo" },
  };
  const m = map[s] ?? { cls: "border-cream/15 text-cream/40", label: status };
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-sans text-[0.54rem] uppercase tracking-luxe ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

function ShipmentButton({
  orderId,
  initial,
}: {
  orderId: string;
  initial: string | null;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    initial === "registered" ? "done" : "idle"
  );
  const [msg, setMsg] = useState(initial === "registered" ? "Registreeritud ✓" : "");

  async function register() {
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/admin/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const d = await res.json();
      if (!res.ok) {
        setState("error");
        setMsg(d.error ?? "Ebaõnnestus.");
        return;
      }
      setState("done");
      setMsg("Registreeritud ✓");
    } catch {
      setState("error");
      setMsg("Ühenduse viga.");
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={register}
        disabled={state === "loading" || state === "done"}
        className="rounded-full border border-gold/40 px-4 py-2 font-sans text-[0.58rem] uppercase tracking-luxe text-gold transition-colors hover:bg-gold/10 disabled:opacity-40"
      >
        {state === "loading" ? "Registreerin…" : "Registreeri saadetis"}
      </button>
      {msg && (
        <span
          className={`ml-3 font-sans text-[0.58rem] uppercase tracking-luxe ${
            state === "error" ? "text-amber-glow" : "text-gold"
          }`}
        >
          {msg}
        </span>
      )}
    </div>
  );
}
