"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOrder, useOrderHydrated } from "@/hooks/useOrder";
import { getPackage } from "@/lib/packages";
import { DEPOSIT_AMOUNT, estimatePrice, formatILS, ONLINE_DISCOUNT } from "@/lib/pricing";
import { LOCATION_LABELS } from "@/lib/labels";

export default function CheckoutSummary() {
  const router = useRouter();
  const hydrated = useOrderHydrated();
  // Slice selectors so each field re-renders only when it changes
  const phone = useOrder((s) => s.phone);
  const packageId = useOrder((s) => s.packageId);
  const areaSqm = useOrder((s) => s.areaSqm);
  const location = useOrder((s) => s.location);
  const floor = useOrder((s) => s.floor);
  const contactName = useOrder((s) => s.contactName);
  const contactEmail = useOrder((s) => s.contactEmail);
  const companyName = useOrder((s) => s.companyName);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const s = useOrder.getState();
    if (!s.phone || !s.packageId || !s.areaSqm || !s.location) {
      router.replace("/configure");
    }
  }, [hydrated, router]);

  if (!hydrated) {
    return (
      <div className="py-24 text-center text-ink-secondary text-sm">טוען…</div>
    );
  }

  if (!phone || !packageId || !areaSqm || !location) {
    return null;
  }

  const pkg = getPackage(packageId);
  const estimate = estimatePrice(packageId, areaSqm, location);

  if (!pkg || !estimate) return null;

  async function handleReserve() {
    setError(null);
    setSubmitting(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          packageId,
          areaSqm,
          location,
          floor,
          contactName,
          contactEmail,
          companyName,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.ok) {
        setError(orderData.message ?? "יצירת ההזמנה נכשלה");
        setSubmitting(false);
        return;
      }

      // Mock provider returns a local /success URL and marks paid immediately.
      // Real providers (Meshulam/CardCom) return their hosted payment page.
      const payRes = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });
      const payData = await payRes.json();
      if (!payData.ok || !payData.redirectUrl) {
        setError(payData.message ?? "הסליקה נכשלה");
        setSubmitting(false);
        return;
      }

      // Absolute URL for real gateways, local /success for mock
      window.location.href = payData.redirectUrl;
    } catch {
      setError("שגיאת רשת");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left: order summary */}
      <div className="lg:col-span-3 space-y-6">
        {/* Package summary */}
        <section className="card p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-xs font-bold text-ink-secondary tracking-widest mb-1">
                {pkg.name}
              </div>
              <div className="text-2xl font-bold text-ink-primary">{pkg.name_he}</div>
            </div>
            <Link
              href="/packages"
              className="text-xs text-primary-500 hover:text-primary-600 font-semibold whitespace-nowrap"
            >
              שינוי
            </Link>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between py-1.5 border-b border-line">
              <span className="text-ink-secondary">תכנון ועיצוב</span>
              <span className="font-medium text-ink-primary">{pkg.features.design}</span>
            </li>
            <li className="flex items-center justify-between py-1.5 border-b border-line">
              <span className="text-ink-secondary">חומרים</span>
              <span className="font-medium text-ink-primary">{pkg.features.materials}</span>
            </li>
            <li className="flex items-center justify-between py-1.5 border-b border-line">
              <span className="text-ink-secondary">תאורה</span>
              <span className="font-medium text-ink-primary">{pkg.features.lighting}</span>
            </li>
            <li className="flex items-center justify-between py-1.5 border-b border-line">
              <span className="text-ink-secondary">מערכות</span>
              <span className="font-medium text-ink-primary">{pkg.features.systems}</span>
            </li>
            <li className="flex items-center justify-between py-1.5 border-b border-line">
              <span className="text-ink-secondary">אחריות</span>
              <span className="font-medium text-ink-primary">{pkg.features.warranty}</span>
            </li>
            <li className="flex items-center justify-between py-1.5">
              <span className="text-ink-secondary">ניהול פרויקט</span>
              <span className="font-medium text-ink-primary">{pkg.features.management}</span>
            </li>
          </ul>
        </section>

        {/* Office details */}
        <section className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-bold text-ink-primary">פרטי המשרד</div>
            <Link
              href="/configure"
              className="text-xs text-primary-500 hover:text-primary-600 font-semibold"
            >
              שינוי
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-ink-secondary mb-1">שטח</dt>
              <dd className="font-bold text-ink-primary tabular-nums">
                {areaSqm.toLocaleString("he-IL")} מ״ר
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-secondary mb-1">אזור</dt>
              <dd className="font-bold text-ink-primary">
                {LOCATION_LABELS[location]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-secondary mb-1">קומה</dt>
              <dd className="font-bold text-ink-primary tabular-nums">
                {floor ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-secondary mb-1">איש קשר</dt>
              <dd className="font-bold text-ink-primary">{contactName}</dd>
            </div>
          </dl>
        </section>

        {/* Trust elements */}
        <section className="card p-6">
          <div className="text-sm font-bold text-ink-primary mb-4">למה לשלם עכשיו?</div>
          <ul className="space-y-3 text-sm">
            <TrustItem
              title="מקדמה ‎₪2,000 בלבד"
              body="החזר מלא תוך 30 יום אם החלטת לא להתקדם"
            />
            <TrustItem
              title={`${pkg.features.warranty} אחריות`}
              body="על כל החומרים והעבודה"
            />
            <TrustItem
              title="85 לקוחות הזמינו החודש"
              body="הצטרף ל-126 פרויקטים שהושלמו"
            />
            <TrustItem
              title="ללא הפתעות"
              body="מחיר קבוע, ‎±10% במקרה הקיצוני"
            />
          </ul>
        </section>
      </div>

      {/* Right: price + CTA */}
      <div className="lg:col-span-2">
        <div className="card p-6 sticky top-24">
          <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4">
            סיכום תמחור
          </div>

          <div className="space-y-2 mb-5 text-sm">
            <div className="flex items-center justify-between text-ink-secondary">
              <span>{pkg.name_he}</span>
              <span className="tabular-nums">{formatILS(pkg.price_per_sqm)}/מ״ר</span>
            </div>
            <div className="flex items-center justify-between text-ink-secondary">
              <span>שטח</span>
              <span className="tabular-nums">{areaSqm.toLocaleString("he-IL")} מ״ר</span>
            </div>
            <div className="flex items-center justify-between text-ink-secondary">
              <span>אזור</span>
              <span>{LOCATION_LABELS[location]}</span>
            </div>
          </div>

          <div className="border-t border-line pt-4 mb-2">
            <div className="flex items-center justify-between text-ink-secondary text-sm mb-1">
              <span>מחיר רכישה</span>
              <span className="line-through tabular-nums">{formatILS(estimate.total)}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-ink-secondary text-sm">הנחת אונליין</span>
              <span className="text-gold-600 font-semibold tabular-nums">
                −{formatILS(ONLINE_DISCOUNT)}
              </span>
            </div>
          </div>

          <div className="border-t-2 border-line pt-4 mb-5">
            <div className="text-xs text-ink-secondary mb-1">מחיר סופי</div>
            <div className="text-4xl font-extrabold text-primary-500 tabular-nums">
              {formatILS(estimate.finalPrice)}
            </div>
            <div className="text-xs text-ink-secondary mt-1">
              זמן ביצוע: {estimate.durationDays.min}–{estimate.durationDays.max} ימים
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary-50 border border-primary-100 mb-4">
            <div className="text-xs text-primary-700 font-semibold mb-1">
              היום משלם רק
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-primary-700 tabular-nums">
                {formatILS(DEPOSIT_AMOUNT)}
              </span>
              <span className="text-xs text-primary-700">מקדמה</span>
            </div>
            <div className="text-[11px] text-primary-700/80 mt-1">
              היתרה משולמת על פי לוח תשלומים בחוזה
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-3 p-3 rounded-lg bg-danger/10 border border-danger/20 text-xs text-danger"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleReserve}
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "מעבד..." : `שריין מקום — ‎₪2,000`}
          </button>

          <p className="text-[11px] text-ink-secondary text-center mt-3">
            🔒 תשלום מאובטח · החזר מלא בתוך 30 יום
          </p>
        </div>
      </div>

      {/* Sticky bottom mirror for mobile */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-line shadow-sticky lg:hidden">
        <div className="container-prose flex items-center justify-between gap-4 py-3">
          <div>
            <div className="text-[11px] text-ink-secondary font-medium">היום</div>
            <div className="text-xl font-extrabold text-primary-500 tabular-nums">
              {formatILS(DEPOSIT_AMOUNT)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleReserve}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "מעבד..." : "שריין מקום"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrustItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <div className="font-semibold text-ink-primary">{title}</div>
        <div className="text-xs text-ink-secondary">{body}</div>
      </div>
    </li>
  );
}
