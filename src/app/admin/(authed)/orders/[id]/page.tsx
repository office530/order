import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrdersStore } from "@/lib/orders-store";
import { getPackage } from "@/lib/packages";
import { formatILS, ONLINE_DISCOUNT, estimatePrice } from "@/lib/pricing";

export const metadata = {
  title: "פרטי הזמנה | RNVT Admin",
  robots: { index: false, follow: false },
};

const LOCATION_LABELS: Record<string, string> = {
  center: "מרכז",
  sharon: "שרון",
  jerusalem: "ירושלים",
  haifa: "חיפה",
  north: "צפון",
  south: "דרום",
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: "ממתינה לתשלום", cls: "bg-ink-secondary/10 text-ink-secondary" },
  paid: { label: "מקדמה שולמה", cls: "bg-success/10 text-success" },
  contract_sent: { label: "חוזה נשלח", cls: "bg-primary-50 text-primary-600" },
  contract_signed: { label: "חוזה חתום", cls: "bg-primary-50 text-primary-600" },
  meeting_scheduled: { label: "פגישה נקבעה", cls: "bg-gold-500/10 text-gold-600" },
  active: { label: "בעבודה", cls: "bg-success/10 text-success" },
  cancelled: { label: "בוטלה", cls: "bg-danger/10 text-danger" },
  refunded: { label: "הוחזר", cls: "bg-ink-secondary/10 text-ink-secondary" },
};

interface PageProps {
  params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const order = await getOrdersStore().get(params.id);
  if (!order) notFound();

  const pkg = getPackage(order.packageId);
  const estimate = pkg
    ? estimatePrice(order.packageId, order.areaSqm, order.location)
    : null;
  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;

  return (
    <>
      <Link
        href="/admin/orders"
        className="inline-flex items-center text-sm text-ink-secondary hover:text-ink-primary transition mb-6"
      >
        ← חזרה להזמנות
      </Link>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-2">הזמנה</p>
          <h1 className="text-3xl font-bold text-ink-primary tracking-tight mb-1">
            {order.contactName || "—"}
          </h1>
          <p
            className="text-sm text-ink-secondary font-mono"
            dir="ltr"
          >
            {order.id}
          </p>
        </div>
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${status.cls}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer */}
        <section className="card p-6">
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4">
            לקוח
          </h2>
          <Field label="שם" value={order.contactName} />
          <Field label="חברה" value={order.companyName ?? "—"} />
          <Field
            label="טלפון"
            value={
              <span dir="ltr" className="font-mono">
                {order.phone}
              </span>
            }
          />
          <Field
            label="אימייל"
            value={
              <a
                dir="ltr"
                href={`mailto:${order.contactEmail}`}
                className="text-primary-500 hover:underline font-mono text-xs break-all"
              >
                {order.contactEmail}
              </a>
            }
          />
        </section>

        {/* Office */}
        <section className="card p-6">
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4">
            פרטי המשרד
          </h2>
          <Field label="חבילה" value={pkg?.name_he ?? order.packageId} />
          <Field
            label="שטח"
            value={
              <span className="tabular-nums">
                {order.areaSqm.toLocaleString("he-IL")} מ״ר
              </span>
            }
          />
          <Field
            label="אזור"
            value={LOCATION_LABELS[order.location] ?? order.location}
          />
          <Field label="קומה" value={order.floor ?? "—"} />
        </section>

        {/* Pricing */}
        <section className="card p-6">
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4">
            תמחור
          </h2>
          {estimate && (
            <>
              <Field
                label="מחיר רכישה"
                value={
                  <span className="line-through tabular-nums text-ink-secondary">
                    {formatILS(estimate.total)}
                  </span>
                }
              />
              <Field
                label="הנחת אונליין"
                value={
                  <span className="tabular-nums text-gold-600">
                    −{formatILS(ONLINE_DISCOUNT)}
                  </span>
                }
              />
              <Field
                label="מחיר סופי"
                value={
                  <span className="tabular-nums font-bold text-primary-500">
                    {formatILS(estimate.finalPrice)}
                  </span>
                }
              />
              <Field
                label="זמן ביצוע"
                value={`${estimate.durationDays.min}–${estimate.durationDays.max} ימים`}
              />
            </>
          )}
        </section>

        {/* Payment */}
        <section className="card p-6 lg:col-span-3">
          <h2 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-4">
            תשלום
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Field
              label="סטטוס מקדמה"
              value={
                order.depositPaid ? (
                  <span className="text-success font-semibold">✓ שולמה</span>
                ) : (
                  <span className="text-ink-secondary">ממתינה</span>
                )
              }
            />
            <Field label="סכום מקדמה" value={formatILS(2000)} />
            <Field
              label="מזהה תשלום"
              value={
                order.paymentId ? (
                  <span className="font-mono text-xs" dir="ltr">
                    {order.paymentId}
                  </span>
                ) : (
                  "—"
                )
              }
            />
            <Field
              label="נוצרה"
              value={new Date(order.createdAt).toLocaleString("he-IL")}
            />
          </div>
        </section>
      </div>
    </>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="py-2 border-b border-line last:border-0">
      <div className="text-[11px] text-ink-secondary uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm text-ink-primary font-medium">{value}</div>
    </div>
  );
}
