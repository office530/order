import { NextResponse } from "next/server";
import {
  adminConfigured,
  buildSessionToken,
  checkPassword,
  setAdminCookie,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "not_configured",
        message: "מערכת האדמין לא מוגדרת. הוסף ADMIN_PASSWORD ל-.env.local",
      },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json(
      { ok: false, error: "invalid_password", message: "סיסמה שגויה" },
      { status: 401 }
    );
  }

  setAdminCookie(buildSessionToken());
  return NextResponse.json({ ok: true });
}
