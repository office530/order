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
 *
 * Renders as a single tabular block: `14d 06:13:36`. Days are spelled out
 * because they're easier to read at a glance; hours/minutes/seconds use
 * a colon-separated digital-clock format.
 *
 * Starts at `null` on first render to avoid hydration mismatch
 * (server `Date.now()` ≠ client `Date.now()`).
 */
export default function Countdown({ deadline, className = "" }: Props) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(calc(deadline));
    const id = setInterval(() => setRemaining(calc(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!remaining) {
    // Reserve space so layout doesn't shift when the timer arrives
    return (
      <span
        className={`inline-block tabular-nums text-sm font-semibold text-ink-primary ${className}`}
        dir="ltr"
      >
        — — :— — :— —
      </span>
    );
  }

  const hh = remaining.hours.toString().padStart(2, "0");
  const mm = remaining.minutes.toString().padStart(2, "0");
  const ss = remaining.seconds.toString().padStart(2, "0");

  return (
    <span
      className={`inline-flex items-center gap-1.5 tabular-nums text-sm font-semibold text-ink-primary ${className}`}
      dir="ltr"
      aria-label={`${remaining.days} ימים ${hh} שעות ${mm} דקות ${ss} שניות`}
    >
      <span>
        {remaining.days}
        <span className="text-ink-secondary font-normal mx-0.5">ימ׳</span>
      </span>
      <span className="text-ink-secondary">·</span>
      <span>
        {hh}:{mm}:{ss}
      </span>
    </span>
  );
}
