import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import {
  generateOtpCode,
  getOtpStore,
  OTP_RATE_LIMIT_MAX,
  OTP_RATE_LIMIT_WINDOW_MIN,
  OTP_TTL_MS,
} from "@/lib/otp-store";

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

  // TODO: integrate Twilio / InforuMobile in step 7. For now: console only.
  // eslint-disable-next-line no-console
  console.log(`[OTP] phone=${phone} code=${code} expires=${new Date(expiresAt).toISOString()}`);

  return NextResponse.json({
    ok: true,
    expiresAt,
    // Return code in dev only — never in production
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  });
}
