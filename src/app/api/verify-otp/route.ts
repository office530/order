import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { getOtpStore, OTP_MAX_ATTEMPTS } from "@/lib/otp-store";

export async function POST(request: Request) {
  let body: { phone?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const phone = body.phone ? normalizePhone(body.phone) : null;
  const code = (body.code ?? "").trim();

  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "invalid_phone", message: "מספר טלפון לא תקין" },
      { status: 400 }
    );
  }
  if (!/^\d{4,6}$/.test(code)) {
    return NextResponse.json(
      { ok: false, error: "invalid_code_format", message: "קוד לא תקין" },
      { status: 400 }
    );
  }

  const store = getOtpStore();
  const session = await store.getActive(phone);

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "no_session", message: "לא נשלח קוד או שפג תוקפו. נסה לשלוח שוב." },
      { status: 404 }
    );
  }

  if (session.attempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json(
      {
        ok: false,
        error: "too_many_attempts",
        message: "יותר מדי ניסיונות. בקש קוד חדש.",
      },
      { status: 429 }
    );
  }

  if (session.code !== code) {
    await store.incrementAttempts(phone);
    return NextResponse.json(
      {
        ok: false,
        error: "wrong_code",
        message: "קוד שגוי. נסה שוב.",
        attemptsLeft: Math.max(0, OTP_MAX_ATTEMPTS - session.attempts - 1),
      },
      { status: 401 }
    );
  }

  await store.markVerified(phone);

  // TODO step 4: also create-or-fetch a customer row & start a session cookie
  return NextResponse.json({ ok: true, phone });
}
