import Link from "next/link";
import { getOrdersStore } from "@/lib/orders-store";
import { formatILS } from "@/lib/pricing";
import { getPackage } from "@/lib/packages";

export const metadata = {
  title: "לוח בקרה | RNVT Admin",
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

export default async function AdminDashboardPage() {
  const orders = await getOrdersStore().list();

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.depositPaid).length,
    pending: orders.filter((o) => !o.depositPaid).length,
    revenue: orders
      .filter((o) => o.depositPaid)
      .reduce((sum, o) => sum + 2000, 0),
    pipeline: orders
      .filter((o) => o.depositPaid)
      .reduce((sum, o) => sum + o.estimatedPrice, 0),
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-primary tracking-tight mb-1">
          לוח בקרה
        </h1>
        <p className="text-sm text-ink-secondary">סקירה של כל ההזמנות במערכת</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard label="סה״כ הזמנות" value={stats.total.toString()} />
        <StatCard label="שולמו" value={stats.paid.toString()} />
        <StatCard label="ממתינות" value={stats.pending.toString()} />
        <StatCard label="מקדמות שנגבו" value={formatILS(stats.revenue)} accent="primary" />
        <StatCard label="פייפליין" value={formatILS(stats.pipeline)} accent="gold" />
      </div>

      {/* Orders table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="text-lg font-bold text-ink-primary">הזמנות אחרונות</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-primary-500 hover:text-primary-600"
          >
            כל ההזמנות ←
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-ink-secondary">
            אין עדיין הזמנות. ההזמנות יופיעו כאן ברגע שלקוחות יתחילו להירשם.
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
                {orders.slice(0, 25).map((order) => {
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

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "primary" | "gold";
}) {
  const valueCls =
    accent === "primary"
      ? "text-primary-500"
      : accent === "gold"
        ? "text-gold-600"
        : "text-ink-primary";
  return (
    <div className="card p-5">
      <div className="text-xs text-ink-secondary font-medium uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className={`text-2xl font-extrabold tabular-nums ${valueCls}`}>{value}</div>
    </div>
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
