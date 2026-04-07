"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

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
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const display = useTransform(value, (latest) => {
    const formatted = latest.toLocaleString("he-IL", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
