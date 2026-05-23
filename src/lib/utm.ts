/** UTM attribution — capture from URL → sessionStorage, read back for lead payload */

const UTM_KEY = "nova_utm";
const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmData = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

/** Called on every page load — persists UTM params to sessionStorage if present. */
export function captureUTM(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const data: UtmData = {};
  let hasAny = false;
  UTM_PARAMS.forEach((key) => {
    const val = params.get(key);
    if (val) {
      data[key] = val;
      hasAny = true;
    }
  });
  if (hasAny) {
    try {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(data));
    } catch { /* storage not available */ }
  }
}

/** Returns previously captured UTM data (empty object if none). */
export function getUTM(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}
