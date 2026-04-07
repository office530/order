import { NextResponse } from "next/server";

// TODO: implement in step 3 (OTP)
// בקרוב — יצירת קוד OTP, שמירה ב-Supabase (otp_sessions), שליחה ב-SMS, rate limiting
export async function POST() {
  return NextResponse.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
