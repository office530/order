"use client";

import { AREA_MAX_SQM, AREA_MIN_SQM } from "@/lib/pricing";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const PRESETS = [100, 200, 350, 500, 800];

export default function AreaInput({
  value,
  onChange,
  min = AREA_MIN_SQM,
  max = AREA_MAX_SQM,
  step = 10,
}: Props) {
  const clamped = Math.max(min, Math.min(max, value));
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label htmlFor="cfg-area-num" className="text-sm font-semibold text-ink-primary">
          שטח המשרד
        </label>
        <div className="flex items-baseline gap-1">
          <input
            id="cfg-area-num"
            name="area"
            type="number"
            inputMode="numeric"
            value={clamped}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onChange(n);
            }}
            aria-label="שטח המשרד במטרים רבועים"
            className="w-24 px-3 py-1.5 rounded-lg border border-line bg-white text-lg font-bold text-ink-primary text-center tabular-nums focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
          />
          <span className="text-sm text-ink-secondary font-medium">מ״ר</span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative pt-1 pb-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          dir="ltr"
          aria-label={`גרור לשינוי שטח המשרד, ערך נוכחי ${clamped} מטרים רבועים`}
          className="area-slider"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${percent}%, #E8ECF2 ${percent}%, #E8ECF2 100%)`,
          }}
        />
        <div className="flex justify-between mt-1 text-[11px] text-ink-secondary">
          <span>{min} מ״ר</span>
          <span>{max} מ״ר</span>
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mt-4">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
              clamped === p
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-ink-secondary border-line hover:border-primary-500 hover:text-primary-500",
            ].join(" ")}
          >
            {p} מ״ר
          </button>
        ))}
      </div>

      <style jsx>{`
        .area-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          outline: none;
        }
        .area-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
          transition: transform 0.15s;
        }
        .area-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .area-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </div>
  );
}
