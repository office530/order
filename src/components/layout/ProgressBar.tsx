type Step = "auth" | "packages" | "configure" | "checkout" | "success";

const STEPS: { key: Step; label: string }[] = [
  { key: "auth", label: "אימות" },
  { key: "packages", label: "חבילה" },
  { key: "configure", label: "פרטים" },
  { key: "checkout", label: "סיכום" },
  { key: "success", label: "אישור" },
];

export default function ProgressBar({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="container-prose py-6">
      <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        {STEPS.map((s, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;

          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                    active && "bg-primary-500 text-white shadow-ring-blue",
                    done && "bg-primary-500 text-white",
                    !active && !done && "bg-white border-2 border-line text-ink-secondary",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {done ? "✓" : idx + 1}
                </div>
                <div
                  className={[
                    "text-xs whitespace-nowrap transition-colors",
                    active
                      ? "text-primary-500 font-semibold"
                      : done
                        ? "text-ink-primary font-medium"
                        : "text-ink-secondary",
                  ].join(" ")}
                >
                  {s.label}
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={[
                    "flex-1 h-px mx-2 transition-colors",
                    done ? "bg-primary-500" : "bg-line",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
