import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import {
  generateOtpCode,
  getOtpStore,
  isTestBypassPhone,
  OTP_RATE_LIMIT_MAX,
  OTP_RATE_LIMIT_WINDOW_MIN,
  OTP_TTL_MS,
  TEST_BYPASS_CODE,
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

  const bypass = isTestBypassPhone(phone);
  const code = bypass ? TEST_BYPASS_CODE : generateOtpCode();
  const expiresAt = Date.now() + OTP_TTL_MS;

  await store.create({ phone, code, expiresAt });

  // Skip the SMS dispatch entirely for the bypass number.
  let provider: string = "bypass";
  if (!bypass) {
    const smsResult = await sendOtpSms(phone, code);
    provider = smsResult.provider;
    if (!smsResult.ok) {
      // eslint-disable-next-line no-console
      console.error(
        `[send-otp] SMS failed via ${smsResult.provider}: ${smsResult.error}`
      );
    }
  }

  return NextResponse.json({
    ok: true,
    expiresAt,
    provider,
    // Only return the code in dev — never in production
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  });
}
