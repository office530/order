/**
 * OTP store with two backends:
 *   1. Supabase (otp_sessions table) — when env is configured
 *   2. In-memory Map — fallback for local dev before Supabase is wired
 *
 * The in-memory store survives Next.js HMR by stashing on globalThis.
 * Both backends expose the same async interface.
 */

import "server-only";

export interface OtpSession {
  phone: string;
  code: string;
  expiresAt: number; // ms since epoch
  verified: boolean;
  attempts: number;
  createdAt: number;
}

interface OtpStore {
  create(session: Omit<OtpSession, "verified" | "attempts" | "createdAt">): Promise<void>;
  getActive(phone: string): Promise<OtpSession | null>;
  markVerified(phone: string): Promise<void>;
  incrementAttempts(phone: string): Promise<void>;
  /** how many sends in the last `windowMinutes` for this phone */
  countRecentSends(phone: string, windowMinutes: number): Promise<number>;
}

/* ──────────────────────── In-memory backend ──────────────────────── */

type MemBag = {
  // active session per phone (latest unexpired)
  active: Map<string, OtpSession>;
  // history of send timestamps per phone (for rate limit)
  sends: Map<string, number[]>;
};

const g = globalThis as unknown as { __otpMem?: MemBag };
const mem: MemBag = g.__otpMem ?? {
  active: new Map(),
  sends: new Map(),
};
g.__otpMem = mem;

const memoryStore: OtpStore = {
  async create({ phone, code, expiresAt }) {
    mem.active.set(phone, {
      phone,
      code,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: Date.now(),
    });
    const arr = mem.sends.get(phone) ?? [];
    arr.push(Date.now());
    mem.sends.set(phone, arr);
  },

  async getActive(phone) {
    const s = mem.active.get(phone);
    if (!s) return null;
    if (s.expiresAt < Date.now()) {
      mem.active.delete(phone);
      return null;
    }
    return s;
  },

  async markVerified(phone) {
    const s = mem.active.get(phone);
    if (s) {
      s.verified = true;
      mem.active.set(phone, s);
    }
  },

  async incrementAttempts(phone) {
    const s = mem.active.get(phone);
    if (s) {
      s.attempts += 1;
      mem.active.set(phone, s);
    }
  },

  async countRecentSends(phone, windowMinutes) {
    const cutoff = Date.now() - windowMinutes * 60_000;
    const arr = (mem.sends.get(phone) ?? []).filter((t) => t >= cutoff);
    mem.sends.set(phone, arr);
    return arr.length;
  },
};

/* ──────────────────────── Supabase backend ──────────────────────── */

function supabaseEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function supabaseAdmin() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const supabaseStore: OtpStore = {
  async create({ phone, code, expiresAt }) {
    const sb = await supabaseAdmin();
    await sb.from("otp_sessions").insert({
      phone,
      code,
      expires_at: new Date(expiresAt).toISOString(),
    });
  },

  async getActive(phone) {
    const sb = await supabaseAdmin();
    const { data } = await sb
      .from("otp_sessions")
      .select("*")
      .eq("phone", phone)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return null;
    return {
      phone: data.phone,
      code: data.code,
      expiresAt: new Date(data.expires_at).getTime(),
      verified: data.verified,
      attempts: data.attempts,
      createdAt: new Date(data.created_at).getTime(),
    };
  },

  async markVerified(phone) {
    const sb = await supabaseAdmin();
    const active = await this.getActive(phone);
    if (!active) return;
    await sb
      .from("otp_sessions")
      .update({ verified: true })
      .eq("phone", phone)
      .gte("expires_at", new Date().toISOString());
  },

  async incrementAttempts(phone) {
    const sb = await supabaseAdmin();
    const active = await this.getActive(phone);
    if (!active) return;
    await sb
      .from("otp_sessions")
      .update({ attempts: active.attempts + 1 })
      .eq("phone", phone)
      .gte("expires_at", new Date().toISOString());
  },

  async countRecentSends(phone, windowMinutes) {
    const sb = await supabaseAdmin();
    const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
    const { count } = await sb
      .from("otp_sessions")
      .select("*", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", since);
    return count ?? 0;
  },
};

/* ─────────────────────────── Public API ─────────────────────────── */

export function getOtpStore(): OtpStore {
  return supabaseEnabled() ? supabaseStore : memoryStore;
}

/** OTP code generator. In dev with no Supabase, returns the fixed dev code. */
export function generateOtpCode(): string {
  if (!supabaseEnabled() && process.env.NODE_ENV !== "production") {
    return "1234";
  }
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_RATE_LIMIT_MAX = 3; // sends
export const OTP_RATE_LIMIT_WINDOW_MIN = 60; // per hour
export const OTP_MAX_ATTEMPTS = 5; // per session
