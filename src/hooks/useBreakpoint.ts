import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(queryMobile = "(max-width: 767px)", queryTablet = "(max-width: 1023px)") {
  const getInitial = (): Breakpoint => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return "desktop";
    if (window.matchMedia(queryMobile).matches) return "mobile";
    if (window.matchMedia(queryTablet).matches) return "tablet";
    return "desktop";
  };

  const [bp, setBp] = useState<Breakpoint>(getInitial);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;

    const mMobile = window.matchMedia(queryMobile);
    const mTablet = window.matchMedia(queryTablet);

    const recompute = () => {
      if (mMobile.matches) setBp("mobile");
      else if (mTablet.matches) setBp("tablet");
      else setBp("desktop");
    };

    // compat Safari
    const add = (m: MediaQueryList, fn: () => void) =>
      "addEventListener" in m ? m.addEventListener("change", fn) : (m as any).addListener?.(fn);
    const remove = (m: MediaQueryList, fn: () => void) =>
      "removeEventListener" in m ? m.removeEventListener("change", fn) : (m as any).removeListener?.(fn);

    add(mMobile, recompute);
    add(mTablet, recompute);
    recompute();

    return () => {
      remove(mMobile, recompute);
      remove(mTablet, recompute);
    };
  }, [queryMobile, queryTablet]);

  return {
    breakpoint: bp,
    isMobile: bp === "mobile",
    isTablet: bp === "tablet",
    isDesktop: bp === "desktop",
  };
}
