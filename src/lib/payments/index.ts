import "server-only";
import { mockPaymentProvider } from "./mock";
import { meshulamProvider } from "./meshulam";
import { cardcomProvider } from "./cardcom";
import type { PaymentProvider } from "./types";

export type {
  PaymentProvider,
  InitPaymentInput,
  InitPaymentResult,
  VerifyWebhookInput,
  VerifyWebhookResult,
} from "./types";

/**
 * Selects a payment provider based on env vars.
 *
 * Selection rules (highest priority first):
 *   1. PAYMENT_PROVIDER env var explicitly forces a provider
 *      ("meshulam" / "cardcom" / "mock")
 *   2. Meshulam credentials present → meshulam
 *   3. CardCom credentials present → cardcom
 *   4. Otherwise → mock (instant local success)
 */
export function getPaymentProvider(): PaymentProvider {
  const forced = process.env.PAYMENT_PROVIDER?.toLowerCase();
  if (forced === "meshulam") return meshulamProvider;
  if (forced === "cardcom") return cardcomProvider;
  if (forced === "mock") return mockPaymentProvider;

  if (
    process.env.MESHULAM_USER_ID &&
    process.env.MESHULAM_PAGE_CODE &&
    process.env.MESHULAM_API_KEY
  ) {
    return meshulamProvider;
  }
  if (
    process.env.CARDCOM_TERMINAL &&
    process.env.CARDCOM_USERNAME &&
    process.env.CARDCOM_API_PASSWORD
  ) {
    return cardcomProvider;
  }
  return mockPaymentProvider;
}

/** Returns the publicly-reachable site URL (used for return + webhook URLs) */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"
  );
}
