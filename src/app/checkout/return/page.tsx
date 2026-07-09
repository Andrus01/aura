import type { Metadata } from "next";
import Link from "next/link";
import { verifyToken, montonio } from "@/lib/montonio";
import { prisma } from "@/lib/db";
import { getI18n } from "@/lib/i18n/server";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "Makse staatus",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function getToken(sp: Record<string, string | string[] | undefined>): string | null {
  const keys = ["order-token", "orderToken", "payment-token"];
  for (const k of keys) {
    const v = sp[k];
    if (typeof v === "string") return v;
    if (Array.isArray(v) && v[0]) return v[0];
  }
  return null;
}

export default async function ReturnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [sp, { dict }] = await Promise.all([searchParams, getI18n()]);
  const t = dict.paymentReturn;
  const token = getToken(sp);

  let status = "UNKNOWN";
  let reference = "";

  if (token && montonio.isConfigured()) {
    try {
      const decoded = verifyToken<{
        paymentStatus?: string;
        merchantReference?: string;
      }>(token);
      status = decoded.paymentStatus?.toUpperCase() || "UNKNOWN";
      reference = decoded.merchantReference ?? "";

      // Persist status on return too (webhook is authoritative, this is a fast path)
      if (reference) {
        await prisma.order.updateMany({
          where: { reference },
          data: {
            paymentStatus: status,
            status:
              status === "PAID" ? "paid" : status === "ABANDONED" ? "abandoned" : "pending",
          },
        });
      }
    } catch {
      status = "UNKNOWN";
    }
  }

  const paid = status === "PAID";
  const pending = status === "PENDING";

  const heading = paid ? t.paidTitle : pending ? t.pendingTitle : t.failedTitle;
  const body = paid ? t.paidBody : pending ? t.pendingBody : t.failedBody;

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-ink px-6 py-24">
      {paid && <ClearCart />}
      <div className="w-full max-w-lg text-center">
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border text-2xl ${
            paid ? "border-gold text-gold" : "border-cream/30 text-cream/60"
          }`}
        >
          {paid ? "✓" : pending ? "…" : "!"}
        </span>
        <h1 className="display mt-8 text-[clamp(2rem,5vw,3.2rem)] text-cream">{heading}</h1>
        <p className="mt-5 font-sans text-[0.95rem] leading-relaxed text-cream/60">{body}</p>
        {reference && (
          <p className="mt-3 font-serif text-3xl italic text-gold">{reference}</p>
        )}
        <div className="mt-10 flex items-center justify-center gap-4">
          {!paid && (
            <Link href="/checkout" className="btn-gold">
              {t.retry}
            </Link>
          )}
          <Link href="/" className="btn-ghost">
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
