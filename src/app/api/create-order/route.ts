import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { getOrdersStore } from "@/lib/orders-store";
import { estimatePrice } from "@/lib/pricing";
import type { Location, PackageId } from "@/lib/types";

const VALID_PACKAGES: PackageId[] = ["essential", "classic", "premium", "signature"];
const VALID_LOCATIONS: Location[] = [
  "center",
  "sharon",
  "north",
  "south",
  "jerusalem",
  "haifa",
];

interface Body {
  phone?: string;
  packageId?: string;
  areaSqm?: number;
  location?: string;
  floor?: number | null;
  contactName?: string;
  contactEmail?: string;
  companyName?: string | null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const phone = body.phone ? normalizePhone(body.phone) : null;
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "invalid_phone", message: "מספר טלפון חסר או לא תקין" },
      { status: 400 }
    );
  }

  if (!body.packageId || !VALID_PACKAGES.includes(body.packageId as PackageId)) {
    return NextResponse.json(
      { ok: false, error: "invalid_package", message: "חבילה לא תקינה" },
      { status: 400 }
    );
  }
  if (!body.location || !VALID_LOCATIONS.includes(body.location as Location)) {
    return NextResponse.json(
      { ok: false, error: "invalid_location", message: "אזור לא תקין" },
      { status: 400 }
    );
  }
  if (
    typeof body.areaSqm !== "number" ||
    body.areaSqm < 50 ||
    body.areaSqm > 2000
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_area", message: "שטח חייב להיות בין 50 ל-2000 מ״ר" },
      { status: 400 }
    );
  }
  if (!body.contactName || body.contactName.trim().length < 2) {
    return NextResponse.json(
      { ok: false, error: "invalid_name", message: "שם איש קשר חסר" },
      { status: 400 }
    );
  }
  if (!body.contactEmail || !/^\S+@\S+\.\S+$/.test(body.contactEmail)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email", message: "אימייל לא תקין" },
      { status: 400 }
    );
  }

  // Compute price server-side — never trust client
  const estimate = estimatePrice(
    body.packageId as PackageId,
    body.areaSqm,
    body.location as Location
  );
  if (!estimate) {
    return NextResponse.json(
      { ok: false, error: "estimate_failed" },
      { status: 500 }
    );
  }

  try {
    const store = getOrdersStore();
    const created = await store.create({
      phone,
      packageId: body.packageId as PackageId,
      areaSqm: body.areaSqm,
      location: body.location as Location,
      floor: typeof body.floor === "number" ? body.floor : null,
      estimatedPrice: estimate.finalPrice,
      contactName: body.contactName.trim(),
      contactEmail: body.contactEmail.trim(),
      companyName: body.companyName?.trim() || null,
    });

    return NextResponse.json({
      ok: true,
      orderId: created.id,
      createdAt: created.createdAt,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[create-order] failed:", err);
    return NextResponse.json(
      { ok: false, error: "store_error", message: "יצירת ההזמנה נכשלה" },
      { status: 500 }
    );
  }
}
