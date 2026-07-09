import { NextResponse } from "next/server";
import { montonio, getPickupPoints } from "@/lib/montonio";

export async function GET(req: Request) {
  if (!montonio.isConfigured()) {
    return NextResponse.json({ points: [], configured: false });
  }
  const { searchParams } = new URL(req.url);
  const carrier = searchParams.get("carrier") || "omniva";
  const country = searchParams.get("country") || "EE";

  const points = await getPickupPoints(carrier, country);
  return NextResponse.json({ points, configured: true });
}
