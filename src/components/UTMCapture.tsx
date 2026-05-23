"use client";

import { useEffect } from "react";
import { captureUTM } from "@/lib/utm";

/** Drop this anywhere in the layout — captures UTM params on first mount. */
export default function UTMCapture() {
  useEffect(() => {
    captureUTM();
  }, []);
  return null;
}
