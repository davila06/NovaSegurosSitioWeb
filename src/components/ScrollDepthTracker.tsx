"use client";

import { useEffect } from "react";
import { initScrollDepth } from "@/lib/analytics";

/** Drop this component anywhere in the page tree to fire scroll-depth events. */
export default function ScrollDepthTracker() {
  useEffect(() => {
    const cleanup = initScrollDepth();
    return cleanup;
  }, []);
  return null;
}
