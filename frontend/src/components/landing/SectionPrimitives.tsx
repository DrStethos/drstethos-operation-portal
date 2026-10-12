import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Label({
  children,
  className,
  light,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p className={cn("label-sm mb-3", light ? "text-white/50" : "text-primary", className)}>
      {children}
    </p>
  );
}

/** GSAP ScrollTrigger target — animated by useLandingGsap */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={className} data-reveal data-delay={delay || undefined}>
      {children}
    </div>
  );
}
