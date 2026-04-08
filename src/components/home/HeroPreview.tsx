"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PACKAGES } from "@/lib/packages";
import { formatILS } from "@/lib/pricing";
import { useOrder } from "@/hooks/useOrder";
import { TIER_HERO_IMAGES } from "@/lib/gallery";
import type { Package, PackageId } from "@/lib/types";

const SHOW_ORDER: PackageId[] = ["signature", "premium", "classic", "essential"];

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
      {(Object.keys(TIER_HERO_IMAGES) as PackageId[]).map((id) => (
        <Image
          key={id}
          src={TIER_HERO_IMAGES[id].src}
          alt={TIER_HERO_IMAGES[id].alt}
          fill
          sizes="(min-width:768px) 70vw, 100vw"
          priority={id === "classic"}
          className={`object-cover transition-opacity duration-500 ${
            selected === id ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-primary/85 via-ink-primary/30 to-transparent" />
      <div className="absolute inset-0 flex">
        <div className="flex-1 hidden md:flex items-end p-10">
          <div className="text-right text-paper">
            <div className="text-xs font-bold tracking-widest mb-2 text-paper/70">
              {selectedPkg.name}
            </div>
            <div className="text-3xl font-extrabold mb-2">
              {selectedPkg.name_he}
            </div>
            <div className="text-sm text-paper/80 mb-4 max-w-sm">
              {TIER_TAGLINE[selected]}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gold-400 tabular-nums">
                {formatILS(selectedPkg.price_per_sqm)}
              </span>
              <span className="text-sm text-paper/80">/ מ״ר</span>
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
