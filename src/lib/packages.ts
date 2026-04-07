import type { Package } from "./types";

/**
 * חבילות סטטיות — תואם למסד הנתונים (supabase/migrations/001_initial.sql).
 * משמש כ-fallback וכמקור אמת ב-client-side לפני קריאות DB.
 */
export const PACKAGES: Package[] = [
  {
    id: "signature",
    name: "SIGNATURE",
    name_he: "סיגנצ׳ר",
    price_per_sqm: 5000,
    sort_order: 1,
    features: {
      design: "עיצוב אדריכלי מלא",
      materials: "חומרים ברמה גבוהה",
      lighting: "תאורה מעצבת",
      partition: "חלוקה פנימית מלאה",
      systems: "מערכות מלאות",
      warranty: "24 חודש",
      management: "מנהל פרויקט צמוד",
    },
  },
  {
    id: "premium",
    name: "PREMIUM",
    name_he: "פרימיום",
    price_per_sqm: 4000,
    sort_order: 2,
    features: {
      design: "עיצוב אדריכלי בסיסי",
      materials: "חומרים ברמה בינונית",
      lighting: "תאורה מעצבת",
      partition: "חלוקה פנימית",
      systems: "מערכות מלאות",
      warranty: "18 חודש",
      management: "מנהל פרויקט צמוד",
    },
  },
  {
    id: "classic",
    name: "CLASSIC",
    name_he: "קלאסיק",
    price_per_sqm: 3500,
    sort_order: 3,
    features: {
      design: "תכנון פנימי",
      materials: "חומרים איכותיים",
      lighting: "תאורה סטנדרטית",
      partition: "חלוקה פנימית",
      systems: "מערכות חלקיות",
      warranty: "12 חודש",
      management: "ליווי פרויקט",
    },
  },
  {
    id: "essential",
    name: "ESSENTIAL",
    name_he: "אסנשיאל",
    price_per_sqm: 3000,
    sort_order: 4,
    features: {
      design: "תכנון סטנדרטי",
      materials: "חומרים סטנדרטיים",
      lighting: "תאורה בסיסית",
      partition: "ללא חלוקה",
      systems: "מערכות בסיסיות",
      warranty: "12 חודש",
      management: "ליווי פרויקט",
    },
  },
];

export function getPackage(id: string): Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}
