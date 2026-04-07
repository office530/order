"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message ?? "התחברות נכשלה");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("שגיאת רשת");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="eyebrow mb-3">אזור מנהל</p>
        <h1 className="text-2xl font-bold text-ink-primary">התחברות</h1>
      </div>

      <label className="block text-sm font-semibold text-ink-primary mb-2">
        סיסמת מנהל
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(null);
        }}
        autoFocus
        required
        className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink-primary focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
      />

      {error && <p className="mt-3 text-sm text-danger text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading || password.length < 1}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? "מתחבר..." : "התחבר"}
      </button>

      <p className="text-xs text-ink-secondary text-center mt-6">
        אזור מוגבל. אם אתה לקוח — חזור ל
        <a href="/" className="text-primary-500 hover:underline">
          {" "}
          דף הבית
        </a>
        .
      </p>
    </form>
  );
}
