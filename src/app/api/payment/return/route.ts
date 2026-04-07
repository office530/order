import { NextResponse } from "next/server";
import { getOrdersStore } from "@/lib/orders-store";
import { siteUrl } from "@/lib/payments";

/**
 * Browser return URL after a payment attempt.
 *
 * Real gateways will hit the webhook (POST /api/payment) asynchronously, but
 * the user lands here first. We poll for paid status briefly and either show
 * /success or send them back to /checkout with an error flag.
 *
 * Some providers redirect with status=cancelled / status=failed query params.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");
  const status = url.searchParams.get("status");
  const base = siteUrl();

  if (!orderId) {
    return NextResponse.redirect(`${base}/checkout?error=missing_order`);
  }
  if (status === "cancelled" || status === "failed") {
    return NextResponse.redirect(
      `${base}/checkout?error=${encodeURIComponent(status)}`
    );
  }

  const store = getOrdersStore();

  // Brief poll — webhook may arrive milliseconds after the user redirect
  for (let attempt = 0; attempt < 5; attempt++) {
    const order = await store.get(orderId);
    if (order?.depositPaid) {
      return NextResponse.redirect(
        `${base}/success?order=${encodeURIComponent(orderId)}`
      );
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  // Webhook didn't land in time — push to success page anyway, the order
  // detail UI can show "ממתין לאישור" if needed (future enhancement)
  return NextResponse.redirect(
    `${base}/success?order=${encodeURIComponent(orderId)}&pending=1`
  );
}
