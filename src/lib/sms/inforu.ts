import "server-only";
import type { SmsProvider } from "./types";

/**
 * InforuMobile JSON API.
 * Docs: https://app.inforu.co.il/integration  (current as of 2026)
 *
 * Required env:
 *   INFORU_USERNAME       (your Inforu account username)
 *   INFORU_API_TOKEN      (API token from the Inforu console)
 *   INFORU_SENDER         (sender id, up to 11 latin chars or registered name)
 *
 * Inforu uses local-format Israeli numbers without "+" — e.g. "0501234567".
 * Some accounts also accept "972501234567"; we use the local format here.
 */
export const inforuProvider: SmsProvider = {
  name: "inforu",
  async send({ toCanonical, body }) {
    const username = process.env.INFORU_USERNAME;
    const token = process.env.INFORU_API_TOKEN;
    const sender = process.env.INFORU_SENDER ?? "RNVT";

    if (!username || !token) {
      return { ok: false, provider: "inforu", error: "missing_credentials" };
    }

    const payload = {
      Data: {
        Message: body,
        Recipients: [{ Phone: toCanonical }],
        Settings: { Sender: sender },
      },
    };

    try {
      const res = await fetch("https://capi.inforu.co.il/api/v2/SMS/SendSms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        StatusId?: number;
        StatusDescription?: string;
        Data?: { BulkId?: number };
      };

      // Inforu convention: StatusId === 1 means success
      if (!res.ok || data.StatusId !== 1) {
        return {
          ok: false,
          provider: "inforu",
          error: data.StatusDescription ?? `http_${res.status}`,
        };
      }

      return {
        ok: true,
        provider: "inforu",
        messageId: data.Data?.BulkId ? String(data.Data.BulkId) : undefined,
      };
    } catch (err) {
      return {
        ok: false,
        provider: "inforu",
        error: err instanceof Error ? err.message : "unknown_error",
      };
    }
  },
};
