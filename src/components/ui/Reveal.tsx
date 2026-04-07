"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
 * Reveal — wrap any block to fade-up when it enters the viewport.
 * Server components can import this freely; only the wrapper hydrates.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  className,
  immediate = false,
}: Props) {
  const animateProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
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
