"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidIsraeliMobile, maskPhone, normalizePhone } from "@/lib/phone";
import { useOrder } from "@/hooks/useOrder";

type Phase = "phone" | "code" | "success";

const CODE_LENGTH = 4;

export default function AuthForm() {
  const router = useRouter();
  const setPhoneStore = useOrder((s) => s.setPhone);

  const [phase, setPhase] = useState<Phase>("phone");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneCanonical, setPhoneCanonical] = useState<string | null>(null);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  /* ───── PHONE PHASE ───── */
  const phoneValid = isValidIsraeliMobile(phoneRaw);

  async function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const canonical = normalizePhone(phoneRaw);
    if (!canonical) {
      setError("מספר טלפון לא תקין. דוגמה: 050-123-4567");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: canonical }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message ?? "שליחת הקוד נכשלה. נסה שוב.");
        setLoading(false);
        return;
      }
      setPhoneCanonical(canonical);
      setExpiresAt(data.expiresAt);
      setDevCode(data.devCode ?? null);
      setPhase("code");
      setCode(Array(CODE_LENGTH).fill(""));
    } catch {
      setError("שגיאת רשת. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  /* ───── CODE PHASE ───── */
  async function submitCode(joined: string) {
    if (!phoneCanonical) return;
    if (joined.length !== CODE_LENGTH) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneCanonical, code: joined }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message ?? "קוד שגוי.");
        setCode(Array(CODE_LENGTH).fill(""));
        setLoading(false);
        // refocus first box
        document.getElementById("otp-0")?.focus();
        return;
      }
      setPhoneStore(phoneCanonical);
      setPhase("success");
      // brief success state, then redirect
      setTimeout(() => router.push("/packages"), 600);
    } catch {
      setError("שגיאת רשת. נסה שוב.");
      setLoading(false);
    }
  }

  async function resendCode() {
    if (!phoneCanonical) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneCanonical }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message ?? "שליחה חוזרת נכשלה.");
      } else {
        setExpiresAt(data.expiresAt);
        setDevCode(data.devCode ?? null);
        setCode(Array(CODE_LENGTH).fill(""));
        document.getElementById("otp-0")?.focus();
      }
    } catch {
      setError("שגיאת רשת.");
    } finally {
      setLoading(false);
    }
  }

  function onCodeChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);

    if (digit && idx < CODE_LENGTH - 1) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }

    const joined = next.join("");
    if (joined.length === CODE_LENGTH && next.every((d) => d !== "")) {
      submitCode(joined);
    }
  }

  function onCodeKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
    if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  }

  function onCodePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (text.length === CODE_LENGTH) {
      e.preventDefault();
      const next = text.split("");
      setCode(next);
      submitCode(text);
    }
  }

  /* ───── RENDER ───── */
  return (
    <div className="card p-8 sm:p-10 max-w-md mx-auto animate-fade-up">
      {phase === "phone" && (
        <form onSubmit={submitPhone} noValidate>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-2 text-center">
            אמת את הטלפון שלך
          </h1>
          <p className="text-ink-secondary text-center mb-8">
            נשלח לך קוד אימות חד-פעמי ב-SMS
          </p>

          <label
            htmlFor="auth-phone"
            className="block text-sm font-semibold text-ink-primary mb-2"
          >
            מספר טלפון
          </label>
          <input
            id="auth-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            placeholder="050-123-4567"
            value={phoneRaw}
            onChange={(e) => {
              setPhoneRaw(e.target.value);
              setError(null);
            }}
            autoFocus
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "auth-phone-error" : undefined}
            className="w-full px-4 py-3.5 rounded-lg border border-line bg-white text-ink-primary text-lg tabular-nums text-center focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
          />

          {error && (
            <p
              id="auth-phone-error"
              role="alert"
              className="mt-3 text-sm text-danger text-center"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!phoneValid || loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? "שולח קוד..." : "שלח קוד אימות"}
          </button>

          <p className="text-xs text-ink-secondary text-center mt-6">
            בלחיצה על שליחה אתה מאשר את{" "}
            <a href="#" className="text-primary-500 hover:underline">
              תנאי השימוש
            </a>{" "}
            ו
            <a href="#" className="text-primary-500 hover:underline">
              מדיניות הפרטיות
            </a>
          </p>
        </form>
      )}

      {phase === "code" && phoneCanonical && (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-2 text-center">
            הזן את הקוד
          </h1>
          <p className="text-ink-secondary text-center mb-8">
            שלחנו קוד בן {CODE_LENGTH} ספרות ל-
            <span dir="ltr" className="font-semibold text-ink-primary">
              {maskPhone(phoneCanonical)}
            </span>
          </p>

          <div
            dir="ltr"
            role="group"
            aria-label="קוד אימות"
            className="flex justify-center gap-3 mb-4"
          >
            {code.map((d, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                aria-label={`ספרה ${idx + 1}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                autoFocus={idx === 0}
                onChange={(e) => onCodeChange(idx, e.target.value)}
                onKeyDown={(e) => onCodeKeyDown(idx, e)}
                onPaste={onCodePaste}
                className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 border-line bg-white text-center text-2xl sm:text-3xl font-bold text-ink-primary focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
              />
            ))}
          </div>

          {expiresAt && <CodeTimer expiresAt={expiresAt} />}

          {error && (
            <p className="mt-3 text-sm text-danger text-center">{error}</p>
          )}

          {devCode && (
            <div className="mt-4 p-3 rounded-lg bg-primary-50 border border-primary-200 text-center">
              <p className="text-xs text-primary-700 font-medium">
                🔧 מצב פיתוח — הקוד שלך:{" "}
                <span className="font-bold tabular-nums">{devCode}</span>
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={resendCode}
              disabled={loading}
              className="text-sm text-primary-500 hover:text-primary-600 font-semibold disabled:opacity-50"
            >
              לא קיבלת? שלח קוד חדש
            </button>
            <button
              type="button"
              onClick={() => {
                setPhase("phone");
                setError(null);
                setCode(Array(CODE_LENGTH).fill(""));
              }}
              className="text-sm text-ink-secondary hover:text-ink-primary"
            >
              ← שינוי מספר טלפון
            </button>
          </div>
        </div>
      )}

      {phase === "success" && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-ink-primary mb-1">אומת בהצלחה</h2>
          <p className="text-ink-secondary text-sm">מעביר אותך לבחירת חבילה...</p>
        </div>
      )}
    </div>
  );
}

/* ───────────────── Timer ───────────────── */

function CodeTimer({ expiresAt }: { expiresAt: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function tick() {
      const ms = expiresAt - Date.now();
      setSecondsLeft(Math.max(0, Math.floor(ms / 1000)));
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [expiresAt]);

  if (secondsLeft === null) return <div className="h-5" />;

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const expired = secondsLeft <= 0;

  return (
    <p
      className={`text-center text-sm tabular-nums ${
        expired ? "text-danger font-semibold" : "text-ink-secondary"
      }`}
    >
      {expired ? (
        "הקוד פג תוקף"
      ) : (
        <>
          הקוד תקף עוד{" "}
          <span className="font-semibold text-ink-primary">
            {m}:{s.toString().padStart(2, "0")}
          </span>
        </>
      )}
    </p>
  );
}
