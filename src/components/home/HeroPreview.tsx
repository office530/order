"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PACKAGES } from "@/lib/packages";
import { formatILS } from "@/lib/pricing";
import { useOrder } from "@/hooks/useOrder";
import type { Package, PackageId } from "@/lib/types";

const SHOW_ORDER: PackageId[] = ["signature", "premium", "classic", "essential"];

// Each tier paints the visual area with a different gradient so the
// selection feels like it changes the underlying "render".
const TIER_GRADIENTS: Record<PackageId, string> = {
  signature:
    "linear-gradient(135deg, #FBF7EC 0%, #F4ECD3 40%, #E8D9A8 70%, #D4BC76 100%)",
  premium:
    "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #BFDBFE 70%, #93C5FD 100%)",
  classic:
    "linear-gradient(135deg, #F8F9FC 0%, #E8ECF2 40%, #D5DBE6 70%, #B7C0D0 100%)",
  essential:
    "linear-gradient(135deg, #FAFAFA 0%, #F4F4F5 40%, #E4E4E7 70%, #C8C8CC 100%)",
};

const TIER_TAGLINE: Record<PackageId, string> = {
  signature: "עיצוב אדריכלי מלא · חומרים ברמה גבוהה",
  premium: "עיצוב אדריכלי · חומרים ברמה בינונית",
  classic: "תכנון פנימי · חומרים איכותיים",
  essential: "תכנון בסיסי · חומרים סטנדרטיים",
};

export default function HeroPreview() {
  const router = useRouter();
  const setPackage = useOrder((s) => s.setPackage);
  const [selected, setSelected] = useState<PackageId>("classic");

  const arranged = useMemo(
    () => SHOW_ORDER.map((id) => PACKAGES.find((p) => p.id === id)!),
    []
  );
  const selectedPkg = PACKAGES.find((p) => p.id === selected) as Package;

  function handleContinue() {
    setPackage(selected);
    router.push("/auth");
  }

  return (
    <div
      className="relative aspect-[16/9] rounded-3xl border border-line bg-surface-secondary overflow-hidden shadow-card"
      role="region"
      aria-label="קונפיגורטור חבילות אינטראקטיבי"
    >
      {/* Visual area — left side, large */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: TIER_GRADIENTS[selected] }}
      />
      <div className="absolute inset-0 flex">
        <div className="flex-1 hidden md:flex items-end p-10">
          <div className="text-right">
            <div className="text-xs font-bold text-ink-secondary tracking-widest mb-2">
              {selectedPkg.name}
            </div>
            <div className="text-3xl font-extrabold text-ink-primary mb-2">
              {selectedPkg.name_he}
            </div>
            <div className="text-sm text-ink-secondary mb-4 max-w-sm">
              {TIER_TAGLINE[selected]}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary-500 tabular-nums">
                {formatILS(selectedPkg.price_per_sqm)}
              </span>
              <span className="text-sm text-ink-secondary">/ מ״ר</span>
            </div>
          </div>
        </div>

        {/* Cards panel — right side */}
        <div
          role="radiogroup"
          aria-label="בחירת חבילה"
          className="flex flex-col justify-center gap-3 w-full md:w-72 p-6 md:p-8 bg-white border-s border-line"
        >
          {arranged.map((pkg) => {
            const active = selected === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(pkg.id)}
                className={[
                  "select-card text-right",
                  active && "select-card-active",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-ink-primary">
                      {pkg.name}
                    </div>
                    <div className="text-xs text-ink-secondary">
                      {formatILS(pkg.price_per_sqm)} / מ״ר
                    </div>
                  </div>
                  {active && (
                    <div
                      aria-hidden="true"
                      className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs flex-shrink-0"
                    >
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary w-full mt-2"
          >
            המשך עם {selectedPkg.name_he}
          </button>
        </div>
      </div>
    </div>
  );
}
