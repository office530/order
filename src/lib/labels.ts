import type { Location, OrderStatus } from "./types";

/** Hebrew labels for the 6 supported regions */
export const LOCATION_LABELS: Record<Location, string> = {
  center: "מרכז",
  sharon: "שרון",
  jerusalem: "ירושלים",
  haifa: "חיפה",
  north: "צפון",
  south: "דרום",
};

interface StatusBadge {
  label: string;
  /** Tailwind classes for the badge pill */
  cls: string;
}

/** Hebrew labels + pill colors for every order lifecycle status */
export const STATUS_LABELS: Record<OrderStatus, StatusBadge> = {
  pending: { label: "ממתינה", cls: "bg-ink-secondary/10 text-ink-secondary" },
  paid: { label: "שולמה", cls: "bg-success/10 text-success" },
  contract_sent: { label: "חוזה נשלח", cls: "bg-primary-50 text-primary-600" },
  contract_signed: { label: "חוזה חתום", cls: "bg-primary-50 text-primary-600" },
  meeting_scheduled: { label: "פגישה נקבעה", cls: "bg-gold-500/10 text-gold-600" },
  active: { label: "בעבודה", cls: "bg-success/10 text-success" },
  cancelled: { label: "בוטלה", cls: "bg-danger/10 text-danger" },
  refunded: { label: "הוחזר", cls: "bg-ink-secondary/10 text-ink-secondary" },
};
