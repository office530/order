"use client";

import { useEffect, useState } from "react";

interface Props {
  /** ISO 8601 deadline. e.g. "2026-04-21T23:59:59+03:00" */
  deadline: string;
  className?: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calc(deadline: string): Remaining {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1_000) % 60),
  };
}

/**
 * Countdown — ticks every second to a given deadline.
 * Initialized to null on first render to avoid hydration mismatch
 * (server `Date.now()` ≠ client `Date.now()`).
 */
export default function Countdown({ deadline, className = "" }: Props) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(calc(deadline));
    const id = setInterval(() => setRemaining(calc(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Cell value={remaining?.days} label="ימים" />
      <Sep />
      <Cell value={remaining?.hours} label="שעות" />
      <Sep />
      <Cell value={remaining?.minutes} label="דקות" />
      <Sep />
      <Cell value={remaining?.seconds} label="שניות" />
    </div>
  );
}

function Cell({ value, label }: { value: number | undefined; label: string }) {
  return (
    <div className="text-center min-w-[2.4rem]">
      <div className="text-base sm:text-lg font-bold text-ink-primary tabular-nums leading-none">
        {value === undefined ? "—" : value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] text-ink-secondary uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function Sep() {
  return <div className="text-line-strong text-lg font-light leading-none -mt-2">:</div>;
}
