"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean | null {
  var [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    var mql = window.matchMedia(query);
    setMatches(mql.matches);
    var handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
