"use client";

import { estimatePrice, formatILS, ONLINE_DISCOUNT } from "@/lib/pricing";
import type { Location, PackageId } from "@/lib/types";
import { getPackage } from "@/lib/packages";
import CountUp from "@/components/ui/CountUp";

interface Props {
  packageId: PackageId | null;
  areaSqm: number;
  location: Location | null;
}

export default function PriceCalculator({ packageId, areaSqm, location }: Props) {
  const pkg = packageId ? getPackage(packageId) : null;
  const estimate =
    packageId && location ? estimatePrice(packageId, areaSqm, location) : null;

  return (
    <div className="card p-6 sticky top-24">
      <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4">
        סיכום התמחור
      </div>

      {/* Package line */}
      <div className="flex items-center justify-between py-3 border-b border-line">
        <div>
          <div className="text-xs text-ink-secondary">חבילה</div>
          <div className="text-sm font-bold text-ink-primary">
            {pkg?.name_he ?? "לא נבחרה"}
            {pkg && (
              <span className="text-ink-secondary font-normal">
                {" "}
                · {formatILS(pkg.price_per_sqm)}/מ״ר
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Area line */}
      <div className="flex items-center justify-between py-3 border-b border-line">
        <div>
          <div className="text-xs text-ink-secondary">שטח</div>
          <div className="text-sm font-bold text-ink-primary tabular-nums">
            {areaSqm.toLocaleString("he-IL")} מ״ר
          </div>
        </div>
      </div>

      {/* Location line */}
      <div className="flex items-center justify-between py-3 border-b border-line">
        <div>
          <div className="text-xs text-ink-secondary">אזור</div>
          <div className="text-sm font-bold text-ink-primary">
            {location ? LABELS[location] : "לא נבחר"}
          </div>
        </div>
      </div>

      {/* Estimated total */}
      <div className="pt-5">
        <div className="text-xs text-ink-secondary mb-1">מחיר משוער</div>
        {estimate ? (
          <>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-extrabold text-primary-500 tabular-nums">
                <CountUp to={estimate.finalPrice} prefix="₪" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs mb-4">
              <span className="text-ink-secondary line-through tabular-nums">
                {formatILS(estimate.total)}
              </span>
              <span className="badge-gold">חיסכון {formatILS(ONLINE_DISCOUNT)}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-line text-sm">
              <span className="text-ink-secondary">זמן ביצוע משוער</span>
              <span className="font-bold text-ink-primary tabular-nums">
                {estimate.durationDays.min}–{estimate.durationDays.max} ימים
              </span>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-primary-50 border border-primary-100">
              <div className="text-xs text-primary-700 font-medium mb-1">
                מקדמה לשריון התור
              </div>
              <div className="text-lg font-extrabold text-primary-700 tabular-nums">
                {formatILS(2000)}
              </div>
              <div className="text-[11px] text-primary-700/70 mt-1">
                החזר מלא תוך 30 יום אם לא מתקדמים
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-ink-secondary py-6 text-center">
            מלא את פרטי המשרד כדי לראות מחיר
          </div>
        )}
      </div>
    </div>
  );
}

const LABELS: Record<Location, string> = {
  center: "מרכז",
  sharon: "שרון",
  jerusalem: "ירושלים",
  haifa: "חיפה",
  north: "צפון",
  south: "דרום",
};
