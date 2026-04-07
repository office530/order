import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { getOrdersStore } from "@/lib/orders-store";

/**
 * Webhook endpoint for payment gateways.
 *
 * Both Meshulam and CardCom POST here on a successful charge with their
 * own field naming. We let the active provider parse + verify, then mark
 * the order as paid in the orders store.
 *
 * Accepts both JSON and form-urlencoded bodies (CardCom uses JSON,
 * Meshulam uses form data).
 */
export async function POST(request: Request) {
  const provider = getPaymentProvider();
  const contentType = request.headers.get("content-type") ?? "";

  let payload: Record<string, string> = {};
  if (contentType.includes("application/json")) {
    payload = (await request.json().catch(() => ({}))) as Record<string, string>;
  } else {
    const form = await request.formData().catch(() => null);
    if (form) {
      for (const [k, v] of form.entries()) {
        payload[k] = String(v);
      }
    }
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const verification = await provider.verifyWebhook({ payload, headers });

  if (!verification.ok || !verification.orderId || !verification.paymentId) {
    // eslint-disable-next-line no-console
    console.error(
      `[payment-webhook] ${provider.name} verify failed: ${verification.error}`
    );
    return NextResponse.json(
      { ok: false, error: verification.error ?? "verification_failed" },
      { status: 400 }
    );
  }

  const ordersStore = getOrdersStore();
  await ordersStore.markPaid(verification.orderId, verification.paymentId);

  // eslint-disable-next-line no-console
  console.log(
    `[payment-webhook] ${provider.name} OK · order=${verification.orderId} · paymentId=${verification.paymentId}`
  );

  return NextResponse.json({ ok: true });
}
