import Link from "next/link";
import { getOrdersStore } from "@/lib/orders-store";
import { formatILS } from "@/lib/pricing";
import { getPackage } from "@/lib/packages";

export const metadata = {
  title: "כל ההזמנות | RNVT Admin",
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
  pending: { label: "ממתינה", cls: "bg-ink-secondary/10 text-ink-secondary" },
  paid: { label: "שולמה", cls: "bg-success/10 text-success" },
  contract_sent: { label: "חוזה נשלח", cls: "bg-primary-50 text-primary-600" },
  contract_signed: { label: "חוזה חתום", cls: "bg-primary-50 text-primary-600" },
  meeting_scheduled: { label: "פגישה נקבעה", cls: "bg-gold-500/10 text-gold-600" },
  active: { label: "בעבודה", cls: "bg-success/10 text-success" },
  cancelled: { label: "בוטלה", cls: "bg-danger/10 text-danger" },
  refunded: { label: "הוחזר", cls: "bg-ink-secondary/10 text-ink-secondary" },
};

export default async function AdminOrdersPage() {
  const orders = await getOrdersStore().list();

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink-primary tracking-tight mb-1">
            כל ההזמנות
          </h1>
          <p className="text-sm text-ink-secondary">{orders.length} הזמנות במערכת</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-ink-secondary">
            אין עדיין הזמנות.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-secondary">
                  <Th>תאריך</Th>
                  <Th>לקוח</Th>
                  <Th>חבילה</Th>
                  <Th>שטח</Th>
                  <Th>אזור</Th>
                  <Th>מחיר משוער</Th>
                  <Th>סטטוס</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const pkg = getPackage(order.packageId);
                  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-line last:border-0 hover:bg-surface-secondary/50 transition"
                    >
                      <Td>
                        {new Date(order.createdAt).toLocaleDateString("he-IL")}
                      </Td>
                      <Td>
                        <div className="font-semibold text-ink-primary">
                          {order.contactName || "—"}
                        </div>
                        <div className="text-xs text-ink-secondary" dir="ltr">
                          {order.phone}
                        </div>
                      </Td>
                      <Td>
                        <span className="text-xs font-bold text-ink-secondary tracking-wider">
                          {pkg?.name}
                        </span>
                      </Td>
                      <Td className="tabular-nums">{order.areaSqm} מ״ר</Td>
                      <Td>{LOCATION_LABELS[order.location] ?? order.location}</Td>
                      <Td className="tabular-nums font-semibold">
                        {formatILS(order.estimatedPrice)}
                      </Td>
                      <Td>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </Td>
                      <Td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-primary-500 hover:text-primary-600 font-semibold text-xs"
                        >
                          פתח →
                        </Link>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-right px-4 py-3 text-xs font-semibold text-ink-secondary uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-ink-primary ${className}`}>{children}</td>;
}
