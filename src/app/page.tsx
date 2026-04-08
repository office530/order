import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import Countdown from "@/components/ui/Countdown";
import HeroPreview from "@/components/home/HeroPreview";
import { PACKAGES } from "@/lib/packages";
import { formatILS } from "@/lib/pricing";
import type { PackageId } from "@/lib/types";
import { GALLERY_PHOTOS, ROOM_LABELS, TIER_HERO_IMAGES } from "@/lib/gallery";

const RECOMMENDED_PACKAGE: PackageId = "classic";
const PREVIEW_ORDER: PackageId[] = ["essential", "classic", "premium", "signature"];
const DISCOUNT_DEADLINE = "2026-04-21T23:59:59+03:00";

export default function HomePage() {
  return (
    <>
      <Header />
      <DiscountBanner />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <PackagesPreview />
        <Gallery />
        <Faq />
        <CtaBottom />
      </main>
      <Footer />
    </>
  );
}

function DiscountBanner() {
  return (
    <div className="relative bg-ink-primary text-paper">
      <div className="container-prose flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
          <span className="font-semibold">
            הנחה של <span className="font-serif font-medium">‎₪30,000</span> למזמינים אונליין
          </span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-paper/20" />
        <div className="flex items-center gap-3">
          <span className="text-paper/60 uppercase tracking-wider text-[11px]">תוקף ההצעה</span>
          <Countdown deadline={DISCOUNT_DEADLINE} />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-blueprint -z-10" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(200,169,110,0.08), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-grain opacity-50 -z-10 pointer-events-none" />

      <div className="container-prose pt-24 sm:pt-32 pb-20 text-center">
        <Reveal immediate>
          <p className="eyebrow mb-8 mx-auto">פלטפורמת קונפיגורטור ראשונה בישראל</p>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <h1 className="display-h text-5xl sm:text-7xl lg:text-[5.5rem] mb-8">
            המשרד שלך,
            <br />
            <span className="serif-accent font-medium">מוכן להזמנה</span>
          </h1>
        </Reveal>

        <Reveal immediate delay={0.2}>
          <p className="text-lg sm:text-xl text-ink-secondary max-w-xl mx-auto mb-12 leading-relaxed">
            בחר חבילה, ראה מפרט, שלם מקדמה —
            <br className="hidden sm:block" />
            ואנחנו נעשה את השאר.
          </p>
        </Reveal>

        <Reveal immediate delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/auth" className="btn-primary">
              בחר את המשרד שלך
              <ArrowLeft />
            </Link>
            <Link href="#how" className="btn-ghost">
              איך זה עובד
            </Link>
          </div>
        </Reveal>

        <Reveal immediate delay={0.4}>
          <p className="text-xs text-ink-secondary tracking-wide">
            חינם · ללא התחייבות · החזר מלא תוך 30 יום
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.5}>
        <div className="container-prose pb-24">
          <HeroPreview />
        </div>
      </Reveal>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "126", label: "פרויקטים שהושלמו" },
    { value: "220K", label: "מ״ר שעוצבו" },
    { value: "4.9", label: "דירוג ממוצע" },
  ];

  return (
    <section className="border-y border-line bg-paper">
      <div className="container-prose py-20 sm:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-4 sm:divide-x sm:divide-line sm:divide-x-reverse">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.08}>
              <div className="text-center px-4">
                <div className="font-serif font-light text-7xl sm:text-8xl text-ink-primary mb-4 tracking-tight tabular-nums leading-none">
                  {it.value}
                </div>
                <div className="text-[11px] text-ink-secondary uppercase tracking-[0.25em] font-medium">
                  {it.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "אמת טלפון", body: "הזנת מספר וקוד SMS. שניות." },
    {
      n: "02",
      title: "בחר חבילה",
      body: "ארבע רמות, מאסנשיאל ועד סיגנצ׳ר. הכל שקוף.",
    },
    {
      n: "03",
      title: "הזן פרטים",
      body: "שטח, אזור, קומה — והמערכת מציגה מחיר אמיתי.",
    },
    {
      n: "04",
      title: "שלם מקדמה",
      body: "‎₪2,000 סוגרת מקום. אם לא מתאים — החזר מלא.",
    },
  ];
  return (
    <section id="how" className="py-24 sm:py-32 bg-paper">
      <div className="container-prose">
        <Reveal>
          <div className="mb-20 text-center">
            <p className="eyebrow mb-4 mx-auto">ארבעה צעדים</p>
            <h2 className="display-h text-4xl sm:text-5xl">ככה זה עובד</h2>
          </div>
        </Reveal>

        <div className="arch-rule mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full">
                <div className="font-serif text-5xl text-ink-primary/15 mb-4 tabular-nums leading-none">
                  {s.n}
                </div>
                <h3 className="font-serif text-2xl text-ink-primary mb-3 leading-tight">
                  {s.title}
                </h3>
                <p className="text-ink-secondary text-sm leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesPreview() {
  const packages = PREVIEW_ORDER.map(
    (id) => PACKAGES.find((p) => p.id === id)!
  );
  return (
    <section className="py-24 sm:py-32 bg-surface-secondary border-y border-line">
      <div className="container-prose">
        <Reveal>
          <div className="text-center mb-20">
            <p className="eyebrow mb-4 mx-auto">חבילות</p>
            <h2 className="display-h text-4xl sm:text-5xl mb-5">
              ארבע רמות. <span className="serif-accent">שקיפות מלאה.</span>
            </h2>
            <p className="text-ink-secondary max-w-xl mx-auto leading-relaxed">
              מאסנשיאל ועד סיגנצ׳ר — בחר את הרמה שמתאימה למשרד שלך, ראה מחיר מיידית.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((p, i) => {
            const recommended = p.id === RECOMMENDED_PACKAGE;
            return (
              <Reveal key={p.id} delay={i * 0.07}>
                <div
                  className={`card card-hover relative h-full overflow-hidden ${
                    recommended ? "border-2 border-primary-500" : ""
                  }`}
                >
                  {recommended && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="badge-blue">★ הכי פופולרי</span>
                    </div>
                  )}
                  <div className="aspect-[4/3] relative bg-surface-secondary">
                    <Image
                      src={TIER_HERO_IMAGES[p.id].src}
                      alt={TIER_HERO_IMAGES[p.id].alt}
                      fill
                      sizes="(min-width:1024px) 22vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-semibold text-ink-secondary tracking-[0.25em] uppercase mb-2">
                      {p.name}
                    </div>
                    <div className="font-serif text-2xl text-ink-primary mb-4 leading-tight">
                      {p.name_he}
                    </div>
                    <div className="arch-rule mb-4" />
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif font-light text-4xl text-ink-primary tabular-nums">
                        {formatILS(p.price_per_sqm)}
                      </span>
                      <span className="text-sm text-ink-secondary">/ מ״ר</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <div className="text-center mt-16">
            <Link href="/auth" className="btn-primary">
              בחר את החבילה שלך
              <ArrowLeft />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="projects" className="py-24 sm:py-32 bg-paper">
      <div className="container-prose">
        <Reveal>
          <div className="text-center mb-20">
            <p className="eyebrow mb-4 mx-auto">פרויקטים אחרונים</p>
            <h2 className="display-h text-4xl sm:text-5xl">
              עבודה <span className="serif-accent">מדברת בעד עצמה</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GALLERY_PHOTOS.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 0.08}>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line card-hover bg-surface-secondary">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-primary/85 via-ink-primary/30 to-transparent" />
                <figcaption className="absolute bottom-0 inset-x-0 p-7 text-paper">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-paper/70">
                      {photo.tier}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-paper/40" />
                    <span className="text-[10px] tracking-wider text-paper/70">
                      {ROOM_LABELS[photo.category]}
                    </span>
                  </div>
                  <div className="font-serif text-2xl mb-1 leading-tight">
                    {photo.project}
                  </div>
                  <div className="text-sm text-paper/70 tabular-nums">{photo.area}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "איך אפשר לתת מחיר אמיתי בלי לראות את המקום?",
      a: "אנחנו עובדים עם 4 חבילות סטנדרטיות שמכילות את כל החומרים והעבודות מראש. אתה בוחר רמה, מזין שטח ואזור — והמחיר מחושב לפי מחירונים פנימיים שיצרנו מ-126 פרויקטים קודמים. ‎±10% הוא הטווח הריאלי. אם נדרש שינוי — אתה מאשר אותו לפני התחלת העבודה.",
    },
    {
      q: "מה כולל מקדמה של ‎₪2,000?",
      a: "המקדמה סוגרת לך תור בלוח הזמנים שלנו, מבטלת את הפרויקט מהשוק, ומפעילה את שלב התכנון. אם תחליט בסוף לא להתקדם — תקבל החזר מלא תוך ‎30 יום. ללא שאלות.",
    },
    {
      q: "כמה זמן לוקח פרויקט?",
      a: "פרויקט קלאסי במשרד של ‎200 מ״ר אורך בין ‎45–60 ימי עבודה. סיגנצ׳ר ופרימיום נמשכים ‎60–90 ימים בשל מורכבות העיצוב והחומרים. תאריך התחלה מובטח מראש בחוזה.",
    },
    {
      q: "מה קורה אחרי שאני משלם מקדמה?",
      a: "תוך ‎48 שעות מקבל קישור להסכם דיגיטלי, פגישת אפיון עם מנהל הפרויקט, ולוח זמנים מלא. כל שלב מנוהל אונליין מהדשבורד שלך — תכנון, רכש, ביצוע ומסירה.",
    },
    {
      q: "מה ההבדל ביני לבין שיפוצניק רגיל?",
      a: "אתה לא קונה ימי עבודה — אתה קונה תוצאה. הכל מחוייב מראש בחוזה: לוחות זמנים, חומרים, אחריות של ‎12+ חודשים, ומחיר סופי. ללא תוספות לאורך הדרך.",
    },
  ];
  return (
    <section className="py-24 sm:py-32 bg-surface-secondary border-t border-line">
      <div className="container-prose max-w-3xl">
        <Reveal>
          <div className="text-center mb-20">
            <p className="eyebrow mb-4 mx-auto">שאלות נפוצות</p>
            <h2 className="display-h text-4xl sm:text-5xl">בלי קטנות</h2>
          </div>
        </Reveal>

        <div className="border-t border-line">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 0.05}>
              <details className="group border-b border-line py-6 cursor-pointer transition-colors">
                <summary className="flex items-center justify-between gap-6 list-none rounded outline-none focus-visible:shadow-ring-blue">
                  <span className="font-serif text-xl text-ink-primary leading-snug">
                    {it.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ink-primary text-3xl font-light group-open:rotate-45 transition-transform duration-300 leading-none flex-shrink-0"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-ink-secondary leading-relaxed pe-12">{it.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBottom() {
  return (
    <section className="relative py-32 sm:py-40 bg-paper overflow-hidden">
      <div className="absolute inset-0 bg-blueprint opacity-60 -z-10" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(200,169,110,0.10), transparent 60%)",
        }}
      />
      <div className="container-prose max-w-3xl text-center">
        <Reveal>
          <h2 className="display-h text-5xl sm:text-6xl mb-8">
            מוכן לראות <span className="serif-accent">מחיר?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-ink-secondary mb-12 leading-relaxed">
            שלוש דקות. אפס מחויבות.
            <br className="hidden sm:block" />
            כל המידע שאתה צריך כדי להחליט.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link href="/auth" className="btn-primary">
            בחר את המשרד שלך
            <ArrowLeft />
          </Link>
          <p className="text-xs text-ink-secondary mt-6 tracking-wide">
            חינם · ללא פגישה · ללא רישום אשראי
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
