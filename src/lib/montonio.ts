import "server-only";
import jwt from "jsonwebtoken";

/**
 * Montonio (Stargate Payments + Shipping v2) client — sandbox-first.
 *
 * Auth: JWT signed HS256 with the SECRET key, carrying the ACCESS key.
 *  - POST endpoints: send the request payload itself as the JWT in `{ data: <jwt> }`.
 *  - GET endpoints: send `Authorization: Bearer <jwt>` (payload = { accessKey }).
 *
 * If keys are absent the checkout gracefully falls back to demo mode.
 */

const ENV = (process.env.MONTONIO_ENV || "sandbox").toLowerCase();
const ACCESS_KEY = process.env.MONTONIO_ACCESS_KEY || "";
const SECRET_KEY = process.env.MONTONIO_SECRET_KEY || "";
// Master switch — set MONTONIO_ENABLED=false in .env to pause payments + shipping.
const ENABLED = process.env.MONTONIO_ENABLED !== "false";

const BASES = {
  sandbox: {
    payments: "https://sandbox-stargate.montonio.com",
    shipping: "https://sandbox-shipping.montonio.com",
  },
  live: {
    payments: "https://stargate.montonio.com",
    shipping: "https://shipping.montonio.com",
  },
} as const;

const base = ENV === "live" ? BASES.live : BASES.sandbox;

export const montonio = {
  env: ENV,
  isConfigured(): boolean {
    return ENABLED && !!ACCESS_KEY && !!SECRET_KEY;
  },
};

/** Standard Estonian Montonio bank-link providers (preferredProvider codes). */
export const EE_BANKS: { code: string; name: string }[] = [
  { code: "swedbank", name: "Swedbank" },
  { code: "seb", name: "SEB" },
  { code: "lhv", name: "LHV" },
  { code: "luminor", name: "Luminor" },
  { code: "coop", name: "Coop Pank" },
  { code: "citadele", name: "Citadele" },
  { code: "revolut", name: "Revolut" },
];

// ---------- JWT helpers ----------

function signPayload(payload: object, expiresInSec = 600): string {
  return jwt.sign({ ...payload }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: expiresInSec,
  });
}

function authHeader(): Record<string, string> {
  const token = jwt.sign({ accessKey: ACCESS_KEY }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: 3600,
  });
  return { Authorization: `Bearer ${token}` };
}

/** Verify + decode a token Montonio sent us (webhook orderToken / return token). */
export function verifyToken<T = Record<string, unknown>>(token: string): T {
  return jwt.verify(token, SECRET_KEY, { algorithms: ["HS256"] }) as T;
}

// ---------- Payments ----------

export interface CreatePaymentInput {
  merchantReference: string;
  grandTotal: number; // euros, decimal
  currency?: string;
  locale?: string;
  provider?: string; // bank code
  returnUrl: string;
  notificationUrl: string;
  lineItems: { name: string; quantity: number; finalPrice: number }[];
  customer?: { name: string; email: string; phone?: string };
}

/** Build a Montonio billingAddress from the collected customer fields. */
function billingAddress(customer?: CreatePaymentInput["customer"]) {
  if (!customer) return undefined;
  const parts = customer.name.trim().split(/\s+/);
  const firstName = parts[0] || customer.name;
  const lastName = parts.slice(1).join(" ") || firstName;
  return {
    firstName,
    lastName,
    email: customer.email,
    phoneNumber: customer.phone || null,
    country: "EE",
  };
}

export interface CreatePaymentResult {
  paymentUrl: string;
  uuid?: string;
}

export async function createPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  const currency = input.currency ?? "EUR";
  const payload = {
    accessKey: ACCESS_KEY,
    merchantReference: input.merchantReference,
    returnUrl: input.returnUrl,
    notificationUrl: input.notificationUrl,
    currency,
    grandTotal: input.grandTotal,
    locale: input.locale ?? "et",
    billingAddress: billingAddress(input.customer),
    payment: {
      method: "paymentInitiation",
      amount: input.grandTotal,
      currency,
      methodOptions: {
        preferredProvider: input.provider || undefined,
        preferredCountry: "EE",
        preferredLocale: input.locale ?? "et",
        paymentDescription: `Aura & Ood — ${input.merchantReference}`,
      },
    },
    lineItems: input.lineItems,
  };

  const res = await fetch(`${base.payments}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: signPayload(payload) }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Montonio createPayment ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { paymentUrl?: string; uuid?: string };
  if (!json.paymentUrl) throw new Error("Montonio: paymentUrl puudub vastuses.");
  return { paymentUrl: json.paymentUrl, uuid: json.uuid };
}

/** Fetch Estonian bank-link providers; falls back to the canonical list. */
export async function getPaymentMethods(): Promise<{ code: string; name: string }[]> {
  if (!montonio.isConfigured()) return EE_BANKS;
  try {
    const res = await fetch(`${base.payments}/api/stores/payment-methods`, {
      headers: authHeader(),
      cache: "no-store",
    });
    if (!res.ok) return EE_BANKS;
    const json = (await res.json()) as Record<string, unknown>;
    const banks = extractEeBanks(json);
    return banks.length ? banks : EE_BANKS;
  } catch {
    return EE_BANKS;
  }
}

// Defensively pull EE payment-initiation providers from whatever shape is returned.
function extractEeBanks(json: unknown): { code: string; name: string }[] {
  try {
    const pm = (json as any)?.paymentMethods ?? json;
    const setup =
      pm?.paymentInitiation?.setup ?? pm?.paymentInitiation ?? pm?.setup ?? {};
    const ee = setup?.EE ?? setup?.ee;
    const list: any[] = ee?.paymentMethods ?? ee?.methods ?? ee ?? [];
    const banks = (Array.isArray(list) ? list : [])
      .map((b) => ({
        code: String(b.code ?? b.bic ?? b.uuid ?? b.name ?? "").toLowerCase(),
        name: String(b.name ?? b.title ?? b.code ?? ""),
      }))
      .filter((b) => b.code && b.name);
    return banks;
  } catch {
    return [];
  }
}

// ---------- Shipping v2 ----------

export interface PickupPoint {
  id: string;
  name: string;
  address?: string;
  city?: string;
}

async function shippingGet(path: string): Promise<any> {
  const res = await fetch(`${base.shipping}/api/v2${path}`, {
    headers: authHeader(),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Montonio shipping ${path} ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/** Available shipping methods (carriers). Returns raw list; safe empty on failure. */
export async function getShippingMethods(): Promise<any[]> {
  if (!montonio.isConfigured()) return [];
  try {
    const json = await shippingGet(`/shipping-methods`);
    return Array.isArray(json) ? json : json?.shippingMethods ?? [];
  } catch {
    return [];
  }
}

/** Pickup points (parcel machines) for a carrier + country. */
export async function getPickupPoints(
  carrierCode: string,
  country = "EE"
): Promise<PickupPoint[]> {
  if (!montonio.isConfigured()) return [];
  try {
    const json = await shippingGet(
      `/shipping-methods/pickup-points?carrierCode=${encodeURIComponent(
        carrierCode
      )}&countryCode=${country}`
    );
    const list: any[] = Array.isArray(json) ? json : json?.pickupPoints ?? [];
    return list.map((p) => ({
      id: String(p.id ?? p.pickupPointId ?? p.uuid ?? ""),
      name: String(p.name ?? p.displayName ?? ""),
      address: p.address ?? p.streetAddress ?? undefined,
      city: p.locality ?? p.city ?? undefined,
    }));
  } catch {
    return [];
  }
}

export interface CreateShipmentInput {
  merchantReference: string;
  carrierCode: string;
  pickupPointId?: string;
  receiver: { name: string; email: string; phone: string };
  parcelCount?: number;
}

/**
 * Register a shipment with Montonio Shipping v2 (best-effort).
 * Shipping v2 POST endpoints authenticate via a Bearer JWT header with a JSON body.
 * NOTE: carriers must be enabled for the store in the Montonio partner portal;
 * otherwise the API returns 401/400 (surfaced to the caller).
 */
export async function createShipment(input: CreateShipmentInput): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  if (!montonio.isConfigured()) return { ok: false, error: "Montonio pole seadistatud." };
  try {
    const [firstName, ...rest] = input.receiver.name.trim().split(" ");
    const body = {
      shipments: [
        {
          merchantReference: input.merchantReference,
          shippingMethod: {
            type: "pickupPoint",
            carrierCode: input.carrierCode,
            countryCode: "EE",
            pickupPointId: input.pickupPointId,
          },
          receiver: {
            firstName: firstName || input.receiver.name,
            lastName: rest.join(" ") || "-",
            email: input.receiver.email,
            phoneNumber: input.receiver.phone,
          },
          parcels: [{ amount: input.parcelCount ?? 1, weight: 0.5 }],
        },
      ],
    };

    const res = await fetch(`${base.shipping}/api/v2/shipments`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: `${res.status}: ${JSON.stringify(json).slice(0, 200)}` };
    }
    const id =
      json?.shipments?.[0]?.id ?? json?.[0]?.id ?? json?.id ?? undefined;
    return { ok: true, id: id ? String(id) : undefined };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export const SHIPPING_BASE = base.shipping;
