import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

/**
 * Lightweight admin auth — single shared password from ADMIN_PASSWORD env.
 *
 * On login we set an httpOnly cookie containing an HMAC signature of a fixed
 * payload. The signature is derived from ADMIN_PASSWORD itself, so rotating
 * the password instantly invalidates all existing sessions. No DB needed.
 *
 * Replace with full Supabase auth + role tables once admin requirements grow.
 */

const COOKIE_NAME = "rnvt_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

const SESSION_PAYLOAD = "rnvt-admin-session-v1";

export function adminConfigured(): boolean {
  return secret().length >= 6;
}

export function checkPassword(input: string): boolean {
  if (!adminConfigured()) return false;
  // constant-time compare
  const a = Buffer.from(input);
  const b = Buffer.from(secret());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function buildSessionToken(): string {
  return `${SESSION_PAYLOAD}.${sign(SESSION_PAYLOAD)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (payload !== SESSION_PAYLOAD || !signature) return false;
  const expected = sign(SESSION_PAYLOAD);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/* ────────────── Cookie helpers (server-side) ────────────── */

export function setAdminCookie(token: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminAuthenticated(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}
