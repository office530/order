import { NextResponse } from "next/server";

// TODO: implement in step 3 (OTP)
// בקרוב — בדיקת קוד מול otp_sessions, סימון verified=true, יצירת/החזרת customer
export async function POST() {
  return NextResponse.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
