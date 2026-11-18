"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered reveal wrapper. Elements fade + rise once when they enter
 * the viewport. Kept deliberately subtle to match the "soft" design language.
 */

const directions = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 34, y: 0 },
  right: { x: -34, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.65,
  className,
  once = true,
  amount = 0.15,
}: {
  children: ReactNode;
  delay?: number;
  direction?: keyof typeof directions;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const offset = directions[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children using `RevealItem` animate in sequence. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.12,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: keyof typeof directions;
}) {
  const offset = directions[direction];

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

