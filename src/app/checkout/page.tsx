import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";
import { montonio, getPaymentMethods } from "@/lib/montonio";

export const metadata: Metadata = {
  title: "Vormista tellimus",
  description: "Morning Spirit — checkout.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Carriers offered for parcel-machine delivery (pickup points fetched on demand).
const PARCEL_CARRIERS = [
  { code: "omniva", name: "Omniva pakiautomaat" },
  { code: "smartpost", name: "Itella SmartPost" },
  { code: "dpd", name: "DPD pakiautomaat" },
  { code: "venipak", name: "Venipak" },
];

export default async function CheckoutPage() {
  const configured = montonio.isConfigured();
  const banks = configured ? await getPaymentMethods() : [];

  return (
    <CheckoutClient
      montonioConfigured={configured}
      banks={banks}
      carriers={PARCEL_CARRIERS}
    />
  );
}
