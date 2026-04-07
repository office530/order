import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import {
  generateOtpCode,
  getOtpStore,
  OTP_RATE_LIMIT_MAX,
  OTP_RATE_LIMIT_WINDOW_MIN,
  OTP_TTL_MS,
} from "@/lib/otp-store";
import { sendOtpSms } from "@/lib/sms";

export async function POST(request: Request) {
  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const phone = body.phone ? normalizePhone(body.phone) : null;
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "invalid_phone", message: "מספר טלפון לא תקין" },
      { status: 400 }
    );
  }

  const store = getOtpStore();

  // Rate limit: max N sends per phone per hour
  const recent = await store.countRecentSends(phone, OTP_RATE_LIMIT_WINDOW_MIN);
  if (recent >= OTP_RATE_LIMIT_MAX) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message: `יותר מדי ניסיונות. נסה שוב בעוד שעה.`,
      },
      { status: 429 }
    );
  }

  const code = generateOtpCode();
  const expiresAt = Date.now() + OTP_TTL_MS;

  await store.create({ phone, code, expiresAt });

  // Dispatch via the active SMS provider (console / twilio / inforu).
  // We don't fail the request if SMS fails — the user can resend.
  const smsResult = await sendOtpSms(phone, code);
  if (!smsResult.ok) {
    // eslint-disable-next-line no-console
    console.error(
      `[send-otp] SMS failed via ${smsResult.provider}: ${smsResult.error}`
    );
  }

  return NextResponse.json({
    ok: true,
    expiresAt,
    provider: smsResult.provider,
    // Only return the code in dev — never in production
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  });
}
