"use client";

import Image from "next/image";
import type { Package } from "@/lib/types";
import { formatILS } from "@/lib/pricing";
import { TIER_HERO_IMAGES } from "@/lib/gallery";

interface Props {
  pkg: Package;
  selected: boolean;
  recommended?: boolean;
  onSelect: (id: string) => void;
}

const FEATURE_LABELS: Record<keyof Package["features"], string> = {
  design: "תכנון ועיצוב",
  materials: "חומרים",
  lighting: "תאורה",
  partition: "חלוקה פנימית",
  systems: "מערכות (חשמל, מיזוג, רשת)",
  warranty: "אחריות",
  management: "ניהול פרויקט",
};

export default function PackageCard({ pkg, selected, recommended, onSelect }: Props) {
  const isSignature = pkg.id === "signature";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`בחר חבילת ${pkg.name_he}, ${formatILS(pkg.price_per_sqm)} למטר רבוע`}
      onClick={() => onSelect(pkg.id)}
      className={[
        "relative card card-hover p-6 cursor-pointer transition-all duration-200 h-full flex flex-col text-right",
        "focus:outline-none focus-visible:shadow-ring-blue",
        selected && "border-2 border-primary-500 shadow-ring-blue",
        !selected && recommended && "border-primary-500/40",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {recommended && !isSignature && (
        <div className="absolute -top-3 inset-x-0 flex justify-center pointer-events-none">
          <span className="badge-blue">★ הכי פופולרי</span>
        </div>
      )}
      {isSignature && (
        <div className="absolute -top-3 inset-x-0 flex justify-center pointer-events-none">
          <span className="badge-gold">★ הכי יוקרתי</span>
        </div>
      )}

      <div className="aspect-[5/3] rounded-xl mb-5 overflow-hidden border border-line relative bg-surface-secondary">
        <Image
          src={TIER_HERO_IMAGES[pkg.id].src}
          alt={TIER_HERO_IMAGES[pkg.id].alt}
          fill
          sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-primary/80 to-transparent" />
        <div className="absolute bottom-3 right-4 text-[10px] font-semibold tracking-[0.25em] uppercase text-paper">
          {pkg.name}
        </div>
      </div>

      <div className="text-xs font-bold text-ink-secondary tracking-widest mb-1">
        {pkg.name}
      </div>
      <div className="text-xl font-bold text-ink-primary mb-4">{pkg.name_he}</div>

      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-3xl font-extrabold text-primary-500 tabular-nums">
          {formatILS(pkg.price_per_sqm)}
        </span>
        <span className="text-sm text-ink-secondary">/ מ״ר</span>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {(Object.keys(pkg.features) as (keyof Package["features"])[]).map((key) => (
          <li key={key} className="flex items-start gap-2 text-sm">
            <CheckIcon />
            <div>
              <span className="text-ink-secondary">{FEATURE_LABELS[key]}: </span>
              <span className="text-ink-primary font-medium">{pkg.features[key]}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Presentational pseudo-button — the whole card is the real button */}
      <div
        aria-hidden="true"
        className={[
          "w-full py-3 rounded-lg font-semibold text-center transition-all duration-200",
          selected
            ? "bg-primary-500 text-white"
            : "border border-line text-ink-primary",
        ].join(" ")}
      >
        {selected ? "✓ נבחר" : "בחר חבילה"}
      </div>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 flex-shrink-0"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
