import "server-only";
import type { PaymentProvider } from "./types";
import { getOrdersStore } from "@/lib/orders-store";

/**
 * Mock provider — used in development and when no real gateway is configured.
 * Immediately marks the order as paid and points the browser to /success.
 */
export const mockPaymentProvider: PaymentProvider = {
  name: "mock",

  async init({ order }) {
    const store = getOrdersStore();
    const fakePaymentId = `mock-${Date.now().toString(36)}`;
    await store.markPaid(order.id, fakePaymentId);

    return {
      ok: true,
      provider: "mock",
      providerRef: fakePaymentId,
      redirectUrl: `/success?order=${encodeURIComponent(order.id)}`,
    };
  },

  async verifyWebhook() {
    // Mock provider doesn't post webhooks
    return { ok: false, provider: "mock", error: "no_webhook_for_mock" };
  },
};
