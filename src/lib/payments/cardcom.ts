import "server-only";
import type { PaymentProvider } from "./types";

/**
 * CardCom — LowProfile v11 API.
 * Docs: https://secure.cardcom.solutions/Documentations/Online/swagger
 *
 * Required env:
 *   CARDCOM_TERMINAL    (terminal number)
 *   CARDCOM_USERNAME    (API username)
 *   CARDCOM_API_PASSWORD (API password)
 *
 * Flow:
 *   1. POST /api/v11/LowProfile/Create with TerminalNumber + ApiName + Sum
 *   2. CardCom returns a `Url` for the hosted payment page + `LowProfileId`
 *   3. We redirect the user there
 *   4. CardCom redirects user to SuccessRedirectUrl after charge
 *   5. CardCom POSTs to NotificationUrl asynchronously (webhook)
 *
 * NOTE: This is a scaffold based on documented request/response shapes.
 *       Test against the CardCom test terminal before going live.
 */
export const cardcomProvider: PaymentProvider = {
  name: "cardcom",

  async init({ order, returnUrl, webhookUrl }) {
    const terminal = process.env.CARDCOM_TERMINAL;
    const username = process.env.CARDCOM_USERNAME;
    const password = process.env.CARDCOM_API_PASSWORD;
    if (!terminal || !username || !password) {
      return { ok: false, provider: "cardcom", error: "missing_credentials" };
    }

    const body = {
      TerminalNumber: Number(terminal),
      ApiName: username,
      Operation: "ChargeOnly",
      ReturnValue: order.id, // we recover this in the webhook
      Amount: 2000, // deposit
      ProductName: `מקדמה לפרויקט #${order.id.slice(0, 8)}`,
      SuccessRedirectUrl: returnUrl,
      FailedRedirectUrl: returnUrl + "&status=failed",
      WebHookUrl: webhookUrl,
      Document: {
        Name: order.contactName,
        Email: order.contactEmail,
        Phone: order.phone,
      },
      ISOCoinId: 1, // 1 = ILS
      Language: "he",
    };

    try {
      const res = await fetch(
        "https://secure.cardcom.solutions/api/v11/LowProfile/Create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = (await res.json().catch(() => ({}))) as {
        ResponseCode?: number;
        Description?: string;
        LowProfileId?: string;
        Url?: string;
      };

      if (!res.ok || data.ResponseCode !== 0 || !data.Url) {
        return {
          ok: false,
          provider: "cardcom",
          error: data.Description ?? `http_${res.status}`,
        };
      }

      return {
        ok: true,
        provider: "cardcom",
        providerRef: data.LowProfileId,
        redirectUrl: data.Url,
      };
    } catch (err) {
      return {
        ok: false,
        provider: "cardcom",
        error: err instanceof Error ? err.message : "unknown_error",
      };
    }
  },

  async verifyWebhook({ payload }) {
    // CardCom webhook posts ReturnValue (=our orderId), LowProfileId, Operation
    // and ResponseCode. ResponseCode 0 = success.
    // TODO: verify HMAC if exposed for your account
    const orderId = payload.ReturnValue;
    const paymentId = payload.LowProfileId ?? payload.InternalDealNumber;
    const responseCode = payload.ResponseCode;

    if (!orderId || !paymentId || responseCode !== "0") {
      return {
        ok: false,
        provider: "cardcom",
        error: "invalid_or_unsuccessful",
      };
    }

    return { ok: true, provider: "cardcom", orderId, paymentId };
  },
};
