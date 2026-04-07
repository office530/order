import "server-only";
import type { PaymentProvider } from "./types";

/**
 * Meshulam Grow — createPaymentProcess (Light Server API).
 * Docs: https://meshulam.co.il/api-docs
 *
 * Required env:
 *   MESHULAM_USER_ID
 *   MESHULAM_PAGE_CODE
 *   MESHULAM_API_KEY
 *   MESHULAM_TEST=1   (optional — uses sandbox endpoint)
 *
 * Flow:
 *   1. We POST to createPaymentProcess with sum + cgUid (our orderId in cField1)
 *   2. Meshulam returns a `url` (hosted payment page)
 *   3. We redirect the user there
 *   4. Meshulam POSTs back to webhookUrl on success
 *   5. User is then redirected to returnUrl
 *
 * NOTE: This is a scaffold based on documented request/response shapes.
 *       Test with real credentials in sandbox before going live —
 *       field names occasionally drift between API versions.
 */
export const meshulamProvider: PaymentProvider = {
  name: "meshulam",

  async init({ order, returnUrl, webhookUrl }) {
    const userId = process.env.MESHULAM_USER_ID;
    const pageCode = process.env.MESHULAM_PAGE_CODE;
    const apiKey = process.env.MESHULAM_API_KEY;
    if (!userId || !pageCode || !apiKey) {
      return { ok: false, provider: "meshulam", error: "missing_credentials" };
    }

    const baseUrl =
      process.env.MESHULAM_TEST === "1"
        ? "https://sandbox.meshulam.co.il/api/light/server/4.0/createPaymentProcess"
        : "https://secure.meshulam.co.il/api/light/server/4.0/createPaymentProcess";

    const body = new URLSearchParams({
      userId,
      pageCode,
      apiKey,
      sum: String(2000), // deposit only — full price tracked separately
      description: `מקדמה לפרויקט #${order.id.slice(0, 8)}`,
      paymentType: "regular",
      pageField: JSON.stringify({
        fullName: order.contactName,
        phone: order.phone,
        email: order.contactEmail,
      }),
      // Custom fields — we use cField1 to carry our orderId for the webhook
      cField1: order.id,
      successUrl: returnUrl,
      cancelUrl: returnUrl + "&status=cancelled",
      notifyUrl: webhookUrl,
    });

    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data = (await res.json().catch(() => ({}))) as {
        status?: number;
        data?: { url?: string; processId?: string };
        err?: string;
      };

      if (!res.ok || data.status !== 1 || !data.data?.url) {
        return {
          ok: false,
          provider: "meshulam",
          error: data.err ?? `http_${res.status}`,
        };
      }

      return {
        ok: true,
        provider: "meshulam",
        providerRef: data.data.processId,
        redirectUrl: data.data.url,
      };
    } catch (err) {
      return {
        ok: false,
        provider: "meshulam",
        error: err instanceof Error ? err.message : "unknown_error",
      };
    }
  },

  async verifyWebhook({ payload }) {
    // Meshulam posts the cField1 we set + transactionId on success
    // TODO: verify HMAC signature once Meshulam exposes it for your account
    const orderId = payload.cField1 ?? payload.cfield1;
    const paymentId = payload.transactionId ?? payload.asmachta;
    const status = payload.status;

    if (!orderId || !paymentId || status !== "1") {
      return {
        ok: false,
        provider: "meshulam",
        error: "invalid_or_unsuccessful",
      };
    }

    return { ok: true, provider: "meshulam", orderId, paymentId };
  },
};
