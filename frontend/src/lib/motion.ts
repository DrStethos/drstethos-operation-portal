import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function fadeUp(delay = 0, reduced = false): Variants {
  if (reduced) {
    return { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } };
  }
  return {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease },
    },
  };
}

export function fadeIn(delay = 0, reduced = false): Variants {
  if (reduced) {
    return { hidden: { opacity: 1 }, show: { opacity: 1 } };
  }
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.6, delay, ease },
    },
  };
}

export function scaleIn(delay = 0, reduced = false): Variants {
  if (reduced) {
    return { hidden: { opacity: 1, scale: 1 }, show: { opacity: 1, scale: 1 } };
  }
  return {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, delay, ease },
    },
  };
}

export function useMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function scrollToId(id: string, offset = 64) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
