import { useState, useEffect } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint("mobile");
      else if (width < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
}
