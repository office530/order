"use client";

import type { Package } from "@/lib/types";
import { formatILS } from "@/lib/pricing";

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

      <div
        aria-hidden="true"
        className="aspect-[5/3] rounded-xl mb-5 overflow-hidden border border-line relative"
        style={{
          background: isSignature
            ? "linear-gradient(135deg, #FBF7EC 0%, #F4ECD3 50%, #E8D9A8 100%)"
            : pkg.id === "premium"
              ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)"
              : pkg.id === "classic"
                ? "linear-gradient(135deg, #F8F9FC 0%, #E8ECF2 50%, #D5DBE6 100%)"
                : "linear-gradient(135deg, #FAFAFA 0%, #F4F4F5 50%, #E4E4E7 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-ink-secondary opacity-70 font-medium tracking-wider">
            {pkg.name}
          </div>
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
