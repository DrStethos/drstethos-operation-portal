import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeIn, fadeUp, scaleIn } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "in" | "scale";
}) {
  const reduced = useReducedMotion();
  const variants =
    variant === "scale"
      ? scaleIn(delay, !!reduced)
      : variant === "in"
        ? fadeIn(delay, !!reduced)
        : fadeUp(delay, !!reduced);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
