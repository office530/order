/**
 * SMS provider abstraction.
 *
 * Implementations:
 *   - console.ts → logs only (default fallback, no env required)
 *   - twilio.ts  → Twilio Messages API (international)
 *   - inforu.ts  → InforuMobile (Israeli, cheaper for IL traffic)
 *
 * The right provider is chosen at runtime in index.ts based on env vars.
 */

export interface SmsMessage {
  /** Canonical Israeli phone "0501234567" */
  toCanonical: string;
  /** Message body in Hebrew */
  body: string;
}

export interface SmsResult {
  ok: boolean;
  /** Provider's own message id, if any */
  messageId?: string;
  /** Provider name for logs/debugging */
  provider: string;
  error?: string;
}

export interface SmsProvider {
  name: string;
  send(message: SmsMessage): Promise<SmsResult>;
}
