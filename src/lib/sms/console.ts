import "server-only";
import type { SmsProvider } from "./types";

/**
 * Default no-op provider — prints the SMS to the dev console.
 * Used when no real SMS env vars are configured.
 */
export const consoleProvider: SmsProvider = {
  name: "console",
  async send({ toCanonical, body }) {
    // eslint-disable-next-line no-console
    console.log(
      `\n[SMS:console] → ${toCanonical}\n${"-".repeat(50)}\n${body}\n${"-".repeat(50)}\n`
    );
    return { ok: true, provider: "console", messageId: `console-${Date.now()}` };
  },
};
