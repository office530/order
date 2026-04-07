/**
 * Payment provider abstraction.
 *
 * Implementations:
 *   - mock.ts     → no-op, marks the order paid immediately (default)
 *   - meshulam.ts → Meshulam Grow API (createPaymentProcess)
 *   - cardcom.ts  → CardCom LowProfile v11 API
 *
 * The right provider is chosen at runtime in index.ts based on env vars.
 */

import type { OrderRecord } from "@/lib/orders-store";

export interface InitPaymentInput {
  order: OrderRecord;
  /** Where the gateway should send the user back after payment success */
  returnUrl: string;
  /** Where the gateway should POST the async confirmation webhook */
  webhookUrl: string;
}

export interface InitPaymentResult {
  ok: boolean;
  /** URL the browser should navigate to next.
   *  - For real providers: the hosted gateway page
   *  - For the mock provider: the local /success page
   */
  redirectUrl?: string;
  /** Provider's reference id (so the webhook can correlate) */
  providerRef?: string;
  provider: string;
  error?: string;
}

export interface VerifyWebhookInput {
  /** Raw form/body the webhook posted */
  payload: Record<string, string>;
  /** HTTP headers (lowercased keys) — used for signature verification */
  headers: Record<string, string>;
}

export interface VerifyWebhookResult {
  ok: boolean;
  /** Order id that was paid (from ReturnValue / customField) */
  orderId?: string;
  /** Provider's transaction id */
  paymentId?: string;
  provider: string;
  error?: string;
}

export interface PaymentProvider {
  name: string;
  init(input: InitPaymentInput): Promise<InitPaymentResult>;
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifyWebhookResult>;
}
