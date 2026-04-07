"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  motion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  duration?: number;
  /** decimal places (e.g. 1 for "4.9") */
  decimals?: number;
  /** prefix/suffix around the number */
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Animated counter — counts from 0 → `to` when scrolled into view.
 * Uses Hebrew thousand separator via Intl.NumberFormat.
 *
 * SSR-safe: renders the final value as plain text on the server and
 * during the first client paint. After hydration the animation kicks in.
 * Honors prefers-reduced-motion.
 */
export default function CountUp({
  to,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const display = useTransform(value, (latest) =>
    formatNumber(latest, decimals, prefix, suffix)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduce || !inView) return;
    const controls = animate(value, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [mounted, reduce, inView, to, duration, value]);

  // Pre-hydration / reduced motion → plain final value, no animation
  if (!mounted || reduce) {
    return <span className={className}>{formatNumber(to, decimals, prefix, suffix)}</span>;
  }

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}

function formatNumber(value: number, decimals: number, prefix: string, suffix: string) {
  const formatted = value.toLocaleString("he-IL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${formatted}${suffix}`;
}
