// Gallery manifest — single source of truth for project photos and tier hero shots.
// To add a photo: drop the file into /public/gallery/ and add an entry below.

import type { PackageId } from "@/lib/types";

/**
 * One representative open-space photo per package tier — used by HeroPreview,
 * PackageCard and PackagesPreview to show "what each tier looks like".
 */
export const TIER_HERO_IMAGES: Record<
  PackageId,
  { src: string; alt: string }
> = {
  signature: {
    src: "/gallery/openspace-signature-01.jpg",
    alt: "אופן ספייס יוקרתי ברמת SIGNATURE",
  },
  premium: {
    src: "/gallery/openspace-premium-01.jpg",
    alt: "אופן ספייס מודרני ברמת PREMIUM",
  },
  classic: {
    src: "/gallery/openspace-classic-01.jpg",
    alt: "אופן ספייס סטנדרטי ברמת CLASSIC",
  },
  essential: {
    src: "/gallery/openspace-essential-01.jpg",
    alt: "אופן ספייס בסיסי ברמת ESSENTIAL",
  },
};

export type RoomCategory =
  | "open-space"
  | "meeting-room"
  | "glass-office"
  | "kitchen"
  | "flooring";

export type Tier = "Signature" | "Premium" | "Classic" | "Essential";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: RoomCategory;
  tier: Tier;
  /** Project name shown in the corner label. */
  project: string;
  /** e.g. "850 מ״ר" — shown beneath the project name. */
  area: string;
}

export const ROOM_LABELS: Record<RoomCategory, string> = {
  "open-space": "אופן ספייס",
  "meeting-room": "חדר ישיבות",
  "glass-office": "חדרי זכוכית",
  kitchen: "מטבח וקפיטריה",
  flooring: "חיפויי רצפה",
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/gallery/openspace-signature-01.jpg",
    alt: "אופן ספייס יוקרתי עם ריהוט מעצב ותאורה ארכיטקטונית",
    category: "open-space",
    tier: "Signature",
    project: "Microsoft Tel Aviv",
    area: "850 מ״ר",
  },
  {
    src: "/gallery/glass-signature-01.jpg",
    alt: "חלל עבודה יוקרתי עם מחיצות זכוכית רחבות",
    category: "glass-office",
    tier: "Signature",
    project: "Legal Partners",
    area: "260 מ״ר",
  },
  {
    src: "/gallery/meeting-signature-01.jpg",
    alt: "חדר ישיבות מרכזי עם דלתות זכוכית ושולחן ארוך",
    category: "meeting-room",
    tier: "Signature",
    project: "Microsoft Tel Aviv",
    area: "850 מ״ר",
  },
  {
    src: "/gallery/kitchen-signature-01.jpg",
    alt: "קפיטריה משרדית עם איי מרכזי וישיבה משולבת",
    category: "kitchen",
    tier: "Signature",
    project: "FinTech HQ",
    area: "450 מ״ר",
  },
  {
    src: "/gallery/openspace-premium-01.jpg",
    alt: "אופן ספייס מודרני עם עמדות עבודה מרווחות",
    category: "open-space",
    tier: "Premium",
    project: "Cyber Engineering",
    area: "320 מ״ר",
  },
  {
    src: "/gallery/glass-premium-01.jpg",
    alt: "מסדרון משרדי עם מחיצות זכוכית לחדרי עבודה",
    category: "glass-office",
    tier: "Premium",
    project: "Cyber Engineering",
    area: "320 מ״ר",
  },
  {
    src: "/gallery/meeting-premium-01.jpg",
    alt: "חדר ישיבות בינוני עם שולחן ותאורה משולבת",
    category: "meeting-room",
    tier: "Premium",
    project: "FinTech HQ",
    area: "450 מ״ר",
  },
  {
    src: "/gallery/kitchen-premium-01.jpg",
    alt: "פינת קפה משרדית עם דלפק עץ",
    category: "kitchen",
    tier: "Premium",
    project: "Studio Loft",
    area: "180 מ״ר",
  },
  {
    src: "/gallery/openspace-classic-01.jpg",
    alt: "אופן ספייס סטנדרטי עם פתרונות ישיבה גמישים",
    category: "open-space",
    tier: "Classic",
    project: "Creative Agency",
    area: "210 מ״ר",
  },
  {
    src: "/gallery/glass-classic-01.jpg",
    alt: "תא טלפון משרדי וחלל מסדרון בעיצוב נקי",
    category: "glass-office",
    tier: "Classic",
    project: "Creative Agency",
    area: "210 מ״ר",
  },
  {
    src: "/gallery/flooring-herringbone-01.jpg",
    alt: "פרקט הרינגבון בגוון אגוז",
    category: "flooring",
    tier: "Signature",
    project: "Detail",
    area: "פרקט הרינגבון",
  },
  {
    src: "/gallery/flooring-parquet-01.jpg",
    alt: "פרקט עץ מלא בגוון בהיר",
    category: "flooring",
    tier: "Premium",
    project: "Detail",
    area: "פרקט עץ מלא",
  },
];
