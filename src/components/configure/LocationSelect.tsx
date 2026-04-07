"use client";

import type { Location } from "@/lib/types";

interface Props {
  value: Location | null;
  onChange: (value: Location) => void;
}

const LOCATIONS: { id: Location; label: string; sub: string }[] = [
  { id: "center", label: "מרכז", sub: "תל אביב, רמת גן, גבעתיים" },
  { id: "sharon", label: "שרון", sub: "הרצליה, רעננה, כפר סבא" },
  { id: "jerusalem", label: "ירושלים", sub: "וסביבה" },
  { id: "haifa", label: "חיפה", sub: "וסביבה" },
  { id: "north", label: "צפון", sub: "עפולה, נצרת, קריות" },
  { id: "south", label: "דרום", sub: "ב״ש, אשדוד, אשקלון" },
];

export default function LocationSelect({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink-primary mb-3">
        אזור גיאוגרפי
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {LOCATIONS.map((loc) => {
          const active = value === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onChange(loc.id)}
              className={[
                "select-card text-right",
                active && "select-card-active",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-ink-primary">{loc.label}</div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">{loc.sub}</div>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                    ✓
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
