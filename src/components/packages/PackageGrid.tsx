"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Package, PackageId } from "@/lib/types";
import { useOrder } from "@/hooks/useOrder";
import { formatILS } from "@/lib/pricing";
import PackageCard from "./PackageCard";

interface Props {
  packages: Package[];
}

const RECOMMENDED_ID: PackageId = "classic";

/**
 * Order packages spec-style:
 * SIGNATURE first (anchor pricing), then PREMIUM, CLASSIC (★), ESSENTIAL.
 */
function arrange(pkgs: Package[]): Package[] {
  const order: PackageId[] = ["signature", "premium", "classic", "essential"];
  return order
    .map((id) => pkgs.find((p) => p.id === id))
    .filter((p): p is Package => Boolean(p));
}

export default function PackageGrid({ packages }: Props) {
  const router = useRouter();
  const arranged = arrange(packages);
  const storePackageId = useOrder((s) => s.packageId);
  const setPackage = useOrder((s) => s.setPackage);

  // preselect from store if returning to page, otherwise default to CLASSIC
  const [selected, setSelected] = useState<PackageId>(
    storePackageId ?? RECOMMENDED_ID
  );

  const selectedPkg = arranged.find((p) => p.id === selected) ?? arranged[0];

  function handleSelect(id: string) {
    setSelected(id as PackageId);
  }

  function handleContinue() {
    setPackage(selected);
    router.push("/configure");
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-32">
        {arranged.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selected === pkg.id}
            recommended={pkg.id === RECOMMENDED_ID}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Tesla-style sticky footer */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-line shadow-sticky">
        <div className="container-prose flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="text-center sm:text-right">
            <div className="text-xs text-ink-secondary font-medium">החבילה שנבחרה</div>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-lg font-bold text-ink-primary">
                {selectedPkg?.name_he}
              </span>
              <span className="text-sm text-ink-secondary">·</span>
              <span className="text-lg sm:text-xl font-extrabold text-primary-500 tabular-nums">
                {formatILS(selectedPkg?.price_per_sqm ?? 0)}
              </span>
              <span className="text-xs text-ink-secondary">/ מ״ר</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary whitespace-nowrap w-full sm:w-auto"
          >
            המשך לפרטי המשרד ←
          </button>
        </div>
      </div>
    </>
  );
}
