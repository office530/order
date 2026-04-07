"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  /** when true, runs once on mount instead of on scroll-in */
  immediate?: boolean;
}

/**
 * Reveal — wraps a block so it fades up when it enters the viewport.
 *
 * SSR-safe: on the server (and during the first client paint, before
 * hydration), the content renders as plain HTML at full opacity. This
 * keeps the page usable for screen readers, bots, no-JS clients, and
 * full-page screenshot tools that don't trigger IntersectionObserver.
 *
 * After hydration, the animation kicks in for users with JS. Honors
 * prefers-reduced-motion by skipping animation entirely.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 16,
  className,
  immediate = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-hydration / reduced motion → render plain so content is always visible
  if (!mounted || reduce) {
    return <div className={className}>{children}</div>;
  }

  const animateProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px", amount: 0.1 },
      };

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...animateProps}
    >
      {children}
    </motion.div>
  );
}
