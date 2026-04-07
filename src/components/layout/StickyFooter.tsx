import Link from "next/link";
import { formatILS } from "@/lib/pricing";

interface Props {
  pricePerSqm?: number;
  totalPrice?: number;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Tesla-style sticky footer:
 * - מחיר משוער מצד אחד
 * - כפתור פעולה ראשי מצד שני
 * - תמיד נראה בתחתית המסך בעמודי הקונפיגורטור
 */
export default function StickyFooter({
  pricePerSqm,
  totalPrice,
  ctaLabel = "שריינו מקום — ‎₪2,000",
  ctaHref = "/checkout",
}: Props) {
  return (
    <div className="sticky bottom-0 inset-x-0 z-20 bg-white border-t border-line shadow-sticky">
      <div className="container-prose flex items-center justify-between gap-6 py-4">
        <div>
          <div className="text-xs text-ink-secondary font-medium">מחיר משוער</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary-500 tabular-nums">
              {totalPrice ? formatILS(totalPrice) : "—"}
            </span>
            {pricePerSqm && (
              <span className="text-sm text-ink-secondary">
                ({formatILS(pricePerSqm)}/מ״ר)
              </span>
            )}
          </div>
        </div>

        <Link href={ctaHref} className="btn-primary whitespace-nowrap">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
