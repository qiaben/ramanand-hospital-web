"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Leans toward the pointer in 3D, with a soft light that follows it.
 * Mouse only, so touch scrolling is never affected.
 */
export default function Tilt({
  children,
  className,
  max = 6,
  glare = "rgb(36 104 212 / 0.10)",
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 220, damping: 22 });
  const light = useTransform([x, y], ([lx, ly]: number[]) => `radial-gradient(360px circle at ${lx * 100}% ${ly * 100}%, ${glare}, transparent 62%)`);
  const on = useMotionValue(0);

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width);
          y.set((e.clientY - r.top) / r.height);
          on.set(1);
        }}
        onPointerLeave={() => {
          x.set(0.5);
          y.set(0.5);
          on.set(0);
        }}
      >
        {children}
        <motion.div
          aria-hidden
          style={{ background: light, opacity: on }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        />
      </motion.div>
    </div>
  );
}
