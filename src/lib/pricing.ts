import type { Location, PackageId } from "./types";
import { getPackage } from "./packages";

/**
 * מקדמי אזור — מבוססים על הבדלי עלויות עבודה ולוגיסטיקה.
 * 1.0 = מרכז (ברירת מחדל).
 */
export const LOCATION_MULTIPLIERS: Record<Location, number> = {
  center: 1.0,
  sharon: 1.05,
  jerusalem: 1.05,
  haifa: 1.0,
  north: 0.95,
  south: 0.95,
};

export const DEPOSIT_AMOUNT = Number(process.env.DEPOSIT_AMOUNT ?? 2000);
export const ONLINE_DISCOUNT = Number(process.env.ONLINE_DISCOUNT ?? 30000);

export interface PriceEstimate {
  base: number;
  total: number;
  durationDays: { min: number; max: number };
  discount: number;
  finalPrice: number;
}

export function estimatePrice(
  packageId: PackageId,
  areaSqm: number,
  location: Location
): PriceEstimate | null {
  const pkg = getPackage(packageId);
  if (!pkg) return null;

  const base = pkg.price_per_sqm * areaSqm;
  const total = Math.round(base * LOCATION_MULTIPLIERS[location]);

  // משך משוער: ~0.25 ימי עבודה למ"ר (עם רצפה ותקרה)
  const minDays = Math.max(30, Math.round(areaSqm * 0.22));
  const maxDays = Math.max(45, Math.round(areaSqm * 0.32));

  const discount = ONLINE_DISCOUNT;
  const finalPrice = total - discount;

  return {
    base,
    total,
    durationDays: { min: minDays, max: maxDays },
    discount,
    finalPrice,
  };
}

export function formatILS(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
}
