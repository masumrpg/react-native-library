import { useState, useEffect, useCallback } from "react";
import type { UseMarkforgeTocOptions, UseMarkforgeTocReturn } from "../types.js";

/**
 * Headless hook to track active heading during scroll (Scroll Spy) and navigate to headings.
 */
export function useMarkforgeToc(options: UseMarkforgeTocOptions = {}): UseMarkforgeTocReturn {
  const { rootSelector, headingSelector = "h1, h2, h3, h4, h5, h6", offsetPx = 80 } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const rootElement = rootSelector ? document.querySelector(rootSelector) : null;
    const headings = Array.from(
      (rootElement || document).querySelectorAll(headingSelector)
    ).filter((el) => Boolean(el.id));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible heading closest to the top offset
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current;
          });
          if (topEntry.target.id) {
            setActiveId(topEntry.target.id);
          }
        }
      },
      {
        root: rootElement,
        rootMargin: `-${offsetPx}px 0px -70% 0px`,
        threshold: [0, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, [rootSelector, headingSelector, offsetPx]);

  const scrollToHeading = useCallback((id: string) => {
    if (typeof document === "undefined") return;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      if (typeof window !== "undefined" && window.history?.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  }, []);

  return {
    activeId,
    scrollToHeading,
  };
}

