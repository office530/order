/**
 * Israeli mobile phone helpers.
 * Accepts: 050-1234567, 0501234567, 972501234567, +972501234567
 * Normalizes to canonical 0501234567 (10 digits, leading 0).
 */

const IL_MOBILE_PREFIXES = ["050", "051", "052", "053", "054", "055", "056", "058", "059"];

/** Strip whitespace, dashes, parentheses */
function strip(input: string): string {
  return input.replace(/[\s\-().]/g, "");
}

/** Convert any acceptable form → 10-digit "05X..." or null if invalid */
export function normalizePhone(input: string): string | null {
  let s = strip(input);

  // +972 / 972 prefix → 0
  if (s.startsWith("+972")) s = "0" + s.slice(4);
  else if (s.startsWith("972")) s = "0" + s.slice(3);

  if (!/^\d{10}$/.test(s)) return null;
  if (!IL_MOBILE_PREFIXES.some((p) => s.startsWith(p))) return null;
  return s;
}

export function isValidIsraeliMobile(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** Display form: 050-123-4567 */
export function formatPhoneDisplay(canonical: string): string {
  if (!/^\d{10}$/.test(canonical)) return canonical;
  return `${canonical.slice(0, 3)}-${canonical.slice(3, 6)}-${canonical.slice(6)}`;
}

/** Mask middle digits: 050-***-4567 (used in success/code screens) */
export function maskPhone(canonical: string): string {
  if (!/^\d{10}$/.test(canonical)) return canonical;
  return `${canonical.slice(0, 3)}-***-${canonical.slice(6)}`;
}
