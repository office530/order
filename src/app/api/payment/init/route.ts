import { NextResponse } from "next/server";
import { getOrdersStore } from "@/lib/orders-store";
import { getPaymentProvider, siteUrl } from "@/lib/payments";

export async function POST(request: Request) {
  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.orderId) {
    return NextResponse.json(
      { ok: false, error: "missing_order_id", message: "מזהה הזמנה חסר" },
      { status: 400 }
    );
  }

  const ordersStore = getOrdersStore();
  const order = await ordersStore.get(body.orderId);
  if (!order) {
    return NextResponse.json(
      { ok: false, error: "order_not_found", message: "ההזמנה לא נמצאה" },
      { status: 404 }
    );
  }

  // Already paid? Just send them to /success.
  if (order.depositPaid) {
    return NextResponse.json({
      ok: true,
      provider: "noop",
      redirectUrl: `/success?order=${encodeURIComponent(order.id)}`,
    });
  }

  const provider = getPaymentProvider();
  const base = siteUrl();
  const result = await provider.init({
    order,
    returnUrl: `${base}/api/payment/return?order=${encodeURIComponent(order.id)}`,
    webhookUrl: `${base}/api/payment`,
  });

  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error(`[payment/init] ${result.provider} failed: ${result.error}`);
    return NextResponse.json(
      {
        ok: false,
        provider: result.provider,
        error: result.error,
        message: "הסליקה נכשלה. נסה שוב או בחר אמצעי תשלום אחר.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    provider: result.provider,
    redirectUrl: result.redirectUrl,
  });
}
