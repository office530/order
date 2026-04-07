import "server-only";
import { consoleProvider } from "./console";
import { twilioProvider } from "./twilio";
import { inforuProvider } from "./inforu";
import type { SmsProvider, SmsResult } from "./types";

export type { SmsProvider, SmsResult } from "./types";

/**
 * Selects an SMS provider based on env vars.
 *
 * Selection rules (highest priority first):
 *   1. SMS_PROVIDER env var explicitly forces a provider
 *      ("twilio" / "inforu" / "console")
 *   2. Inforu credentials present → inforu (preferred for IL traffic)
 *   3. Twilio credentials present → twilio
 *   4. Otherwise → console (logs only)
 */
export function getSmsProvider(): SmsProvider {
  const forced = process.env.SMS_PROVIDER?.toLowerCase();
  if (forced === "twilio") return twilioProvider;
  if (forced === "inforu") return inforuProvider;
  if (forced === "console") return consoleProvider;

  if (process.env.INFORU_USERNAME && process.env.INFORU_API_TOKEN) {
    return inforuProvider;
  }
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    return twilioProvider;
  }
  return consoleProvider;
}

/**
 * Sends an OTP code via the active provider with a Hebrew message body.
 * Returns the provider result so the caller can log/observe failures.
 */
export async function sendOtpSms(
  phoneCanonical: string,
  code: string
): Promise<SmsResult> {
  const provider = getSmsProvider();
  const body =
    `קוד האימות שלך ל-RNVT: ${code}\n` +
    `הקוד תקף ל-5 דקות.\n` +
    `אם לא ביקשת — התעלם מההודעה.`;
  return provider.send({ toCanonical: phoneCanonical, body });
}
