type Step = "auth" | "packages" | "configure" | "checkout" | "success";

const STEPS: { key: Step; label: string }[] = [
  { key: "auth", label: "אימות" },
  { key: "packages", label: "חבילה" },
  { key: "configure", label: "פרטים" },
  { key: "checkout", label: "סיכום" },
  { key: "success", label: "סיום" },
];

export default function ProgressBar({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="container-prose py-8">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((s, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={s.key} className="flex-1 flex items-center gap-2 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border transition-colors",
                    active && "bg-gold border-gold text-ink-900",
                    done && "bg-gold/20 border-gold text-gold",
                    !active && !done && "bg-transparent border-ink-700 text-white/40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {done ? "✓" : idx + 1}
                </div>
                <div
                  className={[
                    "text-xs mt-2 whitespace-nowrap",
                    active ? "text-gold font-semibold" : "text-white/50",
                  ].join(" ")}
                >
                  {s.label}
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={[
                    "flex-1 h-px transition-colors",
                    done ? "bg-gold" : "bg-ink-700",
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
