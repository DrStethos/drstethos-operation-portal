import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children?: ReactNode;
  src?: string;
  alt?: string;
  className?: string;
  float?: boolean;
};

/** Realistic device chrome wrapping app screenshots from the Flutter product. */
export function PhoneFrame({ children, src, alt = "", className, float = false }: PhoneFrameProps) {
  const reduced = useReducedMotion();

  const shell = (
    <div
      className={cn(
        "relative mx-auto w-[240px] sm:w-[270px] aspect-[9/19] rounded-[2.4rem] bg-[#111] p-[10px] shadow-lift",
        className
      )}
    >
      <div className="absolute top-[10px] left-1/2 z-20 h-[22px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-white">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" />
        ) : (
          children
        )}
        <div className="pointer-events-none absolute inset-0 phone-shine" aria-hidden="true" />
      </div>
    </div>
  );

  if (!float || reduced) return shell;

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {shell}
    </motion.div>
  );
}

export default PhoneFrame;
