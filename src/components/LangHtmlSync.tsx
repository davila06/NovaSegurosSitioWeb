"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Syncs the <html lang="…"> attribute with the active language selection.
 * Must be rendered inside LangProvider.
 */
export default function LangHtmlSync() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
