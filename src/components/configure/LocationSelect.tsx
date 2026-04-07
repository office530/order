"use client";

import type { Location } from "@/lib/types";
import { LOCATION_LABELS } from "@/lib/labels";

interface Props {
  value: Location | null;
  onChange: (value: Location) => void;
}

// Sub-labels (geographic hints) — labels themselves come from LOCATION_LABELS
// so the source of truth stays in lib/labels.ts.
const LOCATION_SUBLABELS: Record<Location, string> = {
  center: "תל אביב, רמת גן, גבעתיים",
  sharon: "הרצליה, רעננה, כפר סבא",
  jerusalem: "וסביבה",
  haifa: "וסביבה",
  north: "עפולה, נצרת, קריות",
  south: "ב״ש, אשדוד, אשקלון",
};

const LOCATION_ORDER: Location[] = [
  "center",
  "sharon",
  "jerusalem",
  "haifa",
  "north",
  "south",
];

export default function LocationSelect({ value, onChange }: Props) {
  return (
    <div>
      <div
        id="cfg-location-label"
        className="block text-sm font-semibold text-ink-primary mb-3"
      >
        אזור גיאוגרפי
      </div>
      <div
        role="radiogroup"
        aria-labelledby="cfg-location-label"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {LOCATION_ORDER.map((id) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className={[
                "select-card text-right",
                active && "select-card-active",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-ink-primary">
                    {LOCATION_LABELS[id]}
                  </div>
                  <div className="text-[11px] text-ink-secondary mt-0.5">
                    {LOCATION_SUBLABELS[id]}
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
      </div>
    </div>
  );
}
