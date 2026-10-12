import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stethoscope3D from "./Stethoscope3D";

gsap.registerPlugin(ScrollTrigger);

type Pt = { x: number; y: number; w: number; h: number };

function rectOf(id: string): Pt | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 && r.height < 2) return null;
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    w: Math.max(110, r.width),
    h: Math.max(100, r.height),
  };
}

function sectionRect(id: string) {
  return document.getElementById(id)?.getBoundingClientRect() ?? null;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

/**
 * Deterministic scroll placement (no quickTo flicker).
 * hero → connection center (always visible) → hide → under mobile → Why.
 */
const StethoscopeJourney = () => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const steth = ref.current;
    if (!steth) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      steth.style.display = "none";
      return;
    }

    const syncSizes = () => {
      const text = document.getElementById("hero-text-block");
      const hero = document.getElementById("steth-anchor-hero");
      if (text && hero) {
        hero.style.height = `${Math.round(text.getBoundingClientRect().height)}px`;
      }

      const connectText = document.getElementById("connect-text-height");
      const connect = document.getElementById("steth-anchor-connect");
      if (connectText && connect) {
        const h = Math.max(150, Math.round(connectText.getBoundingClientRect().height));
        connect.style.height = `${h}px`;
        connect.style.width = `${Math.round(h)}px`;
      }

      const points = document.getElementById("why-points-grid");
      const whyWrap = document.getElementById("steth-anchor-why")?.parentElement;
      if (points && whyWrap && window.innerWidth >= 1024) {
        const h = Math.round(points.getBoundingClientRect().height);
        whyWrap.style.height = `${h}px`;
        whyWrap.style.width = `${Math.min(320, Math.round(h * 0.85))}px`;
      }
    };

    const heroId = () => {
      const desktop = document.getElementById("steth-anchor-hero");
      const mobile = document.getElementById("steth-anchor-hero-mobile");
      if (window.innerWidth < 1024 && mobile) return "steth-anchor-hero-mobile";
      if (desktop && desktop.offsetParent !== null) return "steth-anchor-hero";
      return mobile ? "steth-anchor-hero-mobile" : "steth-anchor-hero";
    };

    const place = (pt: Pt, rot: number, alpha: number, z = 40) => {
      gsap.set(steth, {
        x: pt.x,
        y: pt.y,
        width: pt.w,
        height: pt.h,
        xPercent: -50,
        yPercent: -50,
        rotation: rot,
        autoAlpha: alpha,
        zIndex: z,
        force3D: true,
      });
    };

    const mix = (a: Pt, b: Pt, t: number): Pt => ({
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      w: lerp(a.w, b.w, t),
      h: lerp(a.h, b.h, t),
    });

    const update = () => {
      syncSizes();

      const vh = window.innerHeight;
      const hero = rectOf(heroId());
      const connect = rectOf("steth-anchor-connect");
      const underProduct = rectOf("steth-anchor-under-product");
      const whyPt = rectOf("steth-anchor-why");

      const about = sectionRect("about");
      const product = sectionRect("product");
      const whySec = sectionRect("why-drstethos");

      if (!hero) return;

      // ——— Why: rise from under mobile app into Why park ———
      if (whySec && whyPt && underProduct && whySec.top < vh * 0.88) {
        const t = clamp((vh * 0.88 - whySec.top) / (vh * 0.88 - vh * 0.42));
        place(mix(underProduct, whyPt, t), lerp(-4, 4, t), 1, 40);
        return;
      }

      // ——— Under mobile app (visible, parked below phones) ———
      if (product && underProduct && product.bottom < vh * 0.92 && product.top < vh * 0.55) {
        // Still in/near product, Why not yet claiming the model
        if (!whySec || whySec.top >= vh * 0.88) {
          const reveal = clamp((vh * 0.92 - product.bottom) / (vh * 0.35));
          place(underProduct, -6, Math.max(0.55, reveal), 8);
          return;
        }
      }

      // ——— Hidden between connection leave and mobile app ———
      if (about && about.bottom < vh * 0.2) {
        const park = underProduct || connect || hero;
        if (park) place(park, 0, 0, 5);
        return;
      }

      // ——— Hold / arrive at connection center ———
      if (about && connect) {
        // Fully in connection: about well into view
        if (about.top <= vh * 0.38 && about.bottom >= vh * 0.45) {
          place(connect, 4, 1, 40);
          return;
        }

        // Traveling hero → connection (always visible)
        if (about.top < vh * 0.82) {
          const t = clamp((vh * 0.82 - about.top) / (vh * 0.82 - vh * 0.38));
          place(mix(hero, connect, t), lerp(-4, 4, t), 1, 40);
          return;
        }
      }

      // ——— Hero ———
      place(hero, -4, 1, 40);
    };

    syncSizes();
    update();

    // Drive placement from live scroll (no scrub catch-up).
    // Coalesce to one update per animation frame so motion stays smooth
    // but always reflects the *current* scroll position.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        invalidateOnRefresh: true,
        onRefresh: update,
      });
    });

    ScrollTrigger.addEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      syncSizes();
      ScrollTrigger.refresh();
      update();
    };
    window.addEventListener("resize", onResize);
    const t1 = window.setTimeout(onResize, 150);
    const t2 = window.setTimeout(onResize, 700);

    const ro = new ResizeObserver(() => {
      syncSizes();
      update();
    });
    ["hero-text-block", "connect-text-height", "why-points-grid", "about", "product"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) ro.observe(el);
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 overflow-visible will-change-transform"
      style={{ width: 280, height: 260, zIndex: 40 }}
      aria-hidden="true"
    >
      <div
        className="relative h-full w-full overflow-visible"
        style={{ filter: "drop-shadow(0 18px 28px rgba(15, 50, 35, 0.3))" }}
      >
        <Stethoscope3D />
      </div>
    </div>
  );
};

export default StethoscopeJourney;
