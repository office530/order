import "server-only";
import { toE164 } from "@/lib/phone";
import type { SmsProvider } from "./types";

/**
 * Twilio Messages API.
 * Docs: https://www.twilio.com/docs/sms/api/message-resource
 *
 * Required env:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER  (sender, must be E.164)
 */
export const twilioProvider: SmsProvider = {
  name: "twilio",
  async send({ toCanonical, body }) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!sid || !token || !from) {
      return { ok: false, provider: "twilio", error: "missing_credentials" };
    }

    const to = toE164(toCanonical);
    if (!to) return { ok: false, provider: "twilio", error: "invalid_phone" };

    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const params = new URLSearchParams({ To: to, From: from, Body: body });
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = (await res.json()) as { sid?: string; message?: string };
      if (!res.ok) {
        return {
          ok: false,
          provider: "twilio",
          error: data.message ?? `http_${res.status}`,
        };
      }
      return { ok: true, provider: "twilio", messageId: data.sid };
    } catch (err) {
      return {
        ok: false,
        provider: "twilio",
        error: err instanceof Error ? err.message : "unknown_error",
      };
    }
  },
};
