"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Quiet entrance: a short rise and fade, once, when scrolled into view. */
export default function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </M>
  );
}

/**
 * Headline whose words rise out of a mask, one after another.
 * `wordClass` is applied to every word (e.g. the blue-to-green text class, which must sit on the moving element).
 */
export function Words({
  text,
  className,
  delay = 0,
  immediate = false,
  wordClass = "",
}: {
  text: string;
  className?: string;
  delay?: number;
  immediate?: boolean;
  wordClass?: string;
}) {
  const words = text.split(" ");
  const anim = immediate
    ? { animate: { y: 0, opacity: 1 } }
    : { whileInView: { y: 0, opacity: 1 }, viewport: { once: true, margin: "-6% 0px" } };
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.22em] -mb-[0.1em] align-bottom">
          <motion.span
            className={`inline-block ${wordClass}`}
            initial={{ y: "108%", opacity: 0 }}
            {...anim}
            transition={{ duration: 0.85, delay: delay + i * 0.08, ease }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
