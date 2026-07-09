import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/products";
import { getOrders } from "@/lib/orders";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always render fresh (never cache the admin view)
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return <AdminLogin />;
  }

  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  return <AdminDashboard products={products} orders={orders} />;
}
