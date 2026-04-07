"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Location } from "@/lib/types";
import { useOrder, useOrderHydrated } from "@/hooks/useOrder";
import AreaInput from "./AreaInput";
import LocationSelect from "./LocationSelect";
import PriceCalculator from "./PriceCalculator";
import {
  AREA_MAX_SQM,
  AREA_MIN_SQM,
  EMAIL_RE,
  estimatePrice,
  formatILS,
} from "@/lib/pricing";

export default function ConfigureForm() {
  const router = useRouter();
  const hydrated = useOrderHydrated();
  const packageId = useOrder((s) => s.packageId);
  const setConfigure = useOrder((s) => s.setConfigure);

  const [area, setArea] = useState<number>(200);
  const [location, setLocation] = useState<Location | null>("center");
  const [floor, setFloor] = useState<string>("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hydrate local form state from the persisted draft once it's available.
  // We snapshot via getState() to avoid making the effect re-run on every
  // store change (which would clobber in-progress edits).
  useEffect(() => {
    if (!hydrated) return;
    const s = useOrder.getState();
    if (s.areaSqm !== null) setArea(s.areaSqm);
    if (s.location !== null) setLocation(s.location);
    if (s.floor !== null) setFloor(String(s.floor));
    if (s.contactName) setContactName(s.contactName);
    if (s.contactEmail) setContactEmail(s.contactEmail);
    if (s.companyName) setCompanyName(s.companyName);
  }, [hydrated]);

  // Redirect to /packages if no package selected — but only after the
  // persisted draft has loaded. Read directly from the store so we always
  // get the freshest snapshot, not a stale React subscription value.
  useEffect(() => {
    if (!hydrated) return;
    if (!useOrder.getState().packageId) {
      router.replace("/packages");
    }
  }, [hydrated, router]);

  const emailValid = contactEmail.length === 0 || EMAIL_RE.test(contactEmail);
  const canSubmit =
    packageId !== null &&
    location !== null &&
    area >= AREA_MIN_SQM &&
    area <= AREA_MAX_SQM &&
    contactName.trim().length >= 2 &&
    emailValid &&
    contactEmail.length > 0;

  const preview =
    packageId && location ? estimatePrice(packageId, area, location) : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!packageId || !location) {
      setError("חסרים פרטים בסיסיים");
      return;
    }
    if (contactName.trim().length < 2) {
      setError("שם איש קשר קצר מדי");
      return;
    }
    if (!emailValid || contactEmail.length === 0) {
      setError("כתובת אימייל לא תקינה");
      return;
    }

    const parsedFloor = floor.trim() === "" ? null : Number(floor);
    setConfigure({
      areaSqm: area,
      location,
      floor: parsedFloor,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      companyName: companyName.trim() || null,
    });

    router.push("/checkout");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form column */}
      <div className="lg:col-span-3 space-y-8">
        {/* Area */}
        <section className="card p-6">
          <AreaInput value={area} onChange={setArea} />
        </section>

        {/* Location */}
        <section className="card p-6">
          <LocationSelect value={location} onChange={setLocation} />
        </section>

        {/* Floor */}
        <section className="card p-6">
          <label
            htmlFor="cfg-floor"
            className="block text-sm font-semibold text-ink-primary mb-2"
          >
            קומה (אופציונלי)
          </label>
          <input
            id="cfg-floor"
            name="floor"
            type="number"
            inputMode="numeric"
            placeholder="למשל: 5"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            aria-describedby="cfg-floor-help"
            className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-line bg-white text-ink-primary focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
          />
          <p id="cfg-floor-help" className="text-xs text-ink-secondary mt-2">
            חשוב לנו לדעת בשביל תיאום לוגיסטיקה ומעלית משא
          </p>
        </section>

        {/* Contact */}
        <section className="card p-6">
          <div className="text-sm font-semibold text-ink-primary mb-4">פרטי קשר</div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="cfg-company"
                className="block text-xs font-semibold text-ink-secondary mb-1"
              >
                שם חברה (אופציונלי)
              </label>
              <input
                id="cfg-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="למשל: סייבר אנג׳ינירינג בע״מ"
                className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink-primary focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
              />
            </div>

            <div>
              <label
                htmlFor="cfg-name"
                className="block text-xs font-semibold text-ink-secondary mb-1"
              >
                שם איש קשר *
              </label>
              <input
                id="cfg-name"
                name="name"
                type="text"
                autoComplete="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="שם מלא"
                required
                aria-required="true"
                className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink-primary focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
              />
            </div>

            <div>
              <label
                htmlFor="cfg-email"
                className="block text-xs font-semibold text-ink-secondary mb-1"
              >
                אימייל *
              </label>
              <input
                id="cfg-email"
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@company.com"
                required
                aria-required="true"
                aria-invalid={!emailValid && contactEmail.length > 0 ? "true" : undefined}
                aria-describedby={
                  !emailValid && contactEmail.length > 0 ? "cfg-email-error" : undefined
                }
                className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink-primary text-left focus:outline-none focus:border-primary-500 focus:shadow-ring-blue transition"
              />
              {!emailValid && contactEmail.length > 0 && (
                <p id="cfg-email-error" role="alert" className="text-xs text-danger mt-1">
                  כתובת אימייל לא תקינה
                </p>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger"
          >
            {error}
          </div>
        )}
      </div>

      {/* Price column */}
      <div className="lg:col-span-2">
        <PriceCalculator packageId={packageId} areaSqm={area} location={location} />
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-line shadow-sticky">
        <div className="container-prose flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="text-center sm:text-right">
            <div className="text-xs text-ink-secondary font-medium">מחיר משוער</div>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-xl sm:text-2xl font-extrabold text-primary-500 tabular-nums">
                {preview ? formatILS(preview.finalPrice) : "—"}
              </span>
              {preview && (
                <span className="text-xs text-ink-secondary line-through tabular-nums">
                  {formatILS(preview.total)}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary whitespace-nowrap w-full sm:w-auto"
          >
            המשך לסיכום ←
          </button>
        </div>
      </div>
    </form>
  );
}
