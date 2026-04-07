import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import Countdown from "@/components/ui/Countdown";

// 14-day discount window — אם רוצה לרענן, החלף את התאריך
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

/* ─────────────────── DISCOUNT BANNER (top, sticky-ish) ─────────────────── */

function DiscountBanner() {
  return (
    <div className="relative bg-gradient-to-l from-primary-50 via-white to-primary-50 border-b border-line">
      <div className="container-prose flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="badge-gold">בלעדי לאתר</span>
          <span className="text-ink-primary font-semibold">
            הנחה של ‎₪30,000 למזמינים אונליין
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-secondary">תוקף ההצעה:</span>
          <Countdown deadline={DISCOUNT_DEADLINE} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* soft gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.06), transparent 60%)",
        }}
      />

      <div className="container-prose pt-20 sm:pt-28 pb-16 text-center">
        <Reveal immediate>
          <span className="badge-gold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 me-1" />
            The Tesla Model for Office Fit-Out
          </span>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <h1 className="text-display-sm sm:text-display lg:text-display-lg text-ink-primary tracking-tight mb-6">
            המשרד שלך,
            <br />
            <span className="text-primary-500">מוכן להזמנה.</span>
          </h1>
        </Reveal>

        <Reveal immediate delay={0.2}>
          <p className="text-lg sm:text-xl text-ink-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            בחר חבילה, ראה מפרט, שלם מקדמה — ואנחנו נעשה את השאר.
            <br className="hidden sm:block" />
            ללא פגישות, ללא הצעות מחיר אינסופיות, ללא הפתעות.
          </p>
        </Reveal>

        <Reveal immediate delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
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
          <p className="text-xs text-ink-secondary">
            חינם · ללא התחייבות · החזר מלא תוך 30 יום אם לא מתאים
          </p>
        </Reveal>
      </div>

      {/* Mock product image — faux configurator preview */}
      <Reveal delay={0.5}>
        <div className="container-prose pb-20">
          <div className="relative aspect-[16/9] rounded-3xl border border-line bg-surface-secondary overflow-hidden shadow-card">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #F8F9FC 0%, #EFF2F8 50%, #F8F9FC 100%)",
              }}
            />
            <div className="absolute inset-0 flex">
              <div className="hidden md:flex flex-col justify-center gap-3 w-72 p-8 bg-white border-s border-line">
                <div className="select-card-active">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-ink-primary">SIGNATURE</div>
                      <div className="text-xs text-ink-secondary">‎₪5,000 / מ״ר</div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  </div>
                </div>
                <div className="select-card">
                  <div className="text-sm font-semibold text-ink-primary">PREMIUM</div>
                  <div className="text-xs text-ink-secondary">‎₪4,000 / מ״ר</div>
                </div>
                <div className="select-card">
                  <div className="text-sm font-semibold text-ink-primary">CLASSIC</div>
                  <div className="text-xs text-ink-secondary">‎₪3,500 / מ״ר</div>
                </div>
                <div className="select-card">
                  <div className="text-sm font-semibold text-ink-primary">ESSENTIAL</div>
                  <div className="text-xs text-ink-secondary">‎₪3,000 / מ״ר</div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center text-ink-secondary text-sm">
                <span className="opacity-60">תצוגה מקדימה של הקונפיגורטור</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── STATS ─────────────────────────── */

function Stats() {
  return (
    <section className="border-y border-line bg-surface-secondary">
      <div className="container-prose py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          <Reveal>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-extrabold text-primary-500 mb-2 tracking-tight tabular-nums">
                <CountUp to={126} />
              </div>
              <div className="text-sm text-ink-secondary uppercase tracking-wider font-medium">
                פרויקטים שהושלמו
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-extrabold text-primary-500 mb-2 tracking-tight tabular-nums">
                <CountUp to={220000} />
              </div>
              <div className="text-sm text-ink-secondary uppercase tracking-wider font-medium">
                מ״ר שעוצבו
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-extrabold text-primary-500 mb-2 tracking-tight tabular-nums">
                <CountUp to={4.9} decimals={1} />
              </div>
              <div className="text-sm text-ink-secondary uppercase tracking-wider font-medium">
                דירוג ממוצע
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── HOW IT WORKS ─────────────────────────── */

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
    <section id="how" className="py-24 bg-white">
      <div className="container-prose">
        <Reveal>
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">ארבעה צעדים</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              ככה זה עובד
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="card card-hover p-7 h-full">
                <div className="text-primary-500 text-sm font-bold mb-4 tracking-wider">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold text-ink-primary mb-2">{s.title}</h3>
                <p className="text-ink-secondary text-sm leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PACKAGES PREVIEW ─────────────────────────── */

function PackagesPreview() {
  const packages = [
    { id: "essential", name: "ESSENTIAL", he: "אסנשיאל", price: "3,000", badge: null },
    { id: "classic", name: "CLASSIC", he: "קלאסיק", price: "3,500", badge: "הכי פופולרי" },
    { id: "premium", name: "PREMIUM", he: "פרימיום", price: "4,000", badge: null },
    { id: "signature", name: "SIGNATURE", he: "סיגנצ׳ר", price: "5,000", badge: null },
  ];
  return (
    <section className="py-24 bg-surface-secondary border-y border-line">
      <div className="container-prose">
        <Reveal>
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">חבילות</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              ארבע רמות. שקיפות מלאה.
            </h2>
            <p className="text-ink-secondary mt-4 max-w-xl mx-auto">
              מאסנשיאל ועד סיגנצ׳ר — בחר את הרמה שמתאימה למשרד שלך, ראה מחיר מיידית.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07}>
              <div
                className={`card card-hover p-6 relative h-full ${
                  p.badge ? "border-2 border-primary-500" : ""
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <span className="badge-gold">{p.badge}</span>
                  </div>
                )}
                <div className="text-xs font-bold text-ink-secondary tracking-widest mb-2">
                  {p.name}
                </div>
                <div className="text-lg font-bold text-ink-primary mb-4">{p.he}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-primary-500 tabular-nums">
                    ₪{p.price}
                  </span>
                  <span className="text-xs text-ink-secondary">/ מ״ר</span>
                </div>
                <div className="text-xs text-ink-secondary">החל מ-‎₪{p.price}/מ״ר</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="text-center mt-12">
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

/* ─────────────────────────── GALLERY ─────────────────────────── */

function Gallery() {
  const projects = [
    { name: "Cyber Engineering", area: "320 מ״ר", style: "Premium" },
    { name: "Microsoft Tel Aviv", area: "850 מ״ר", style: "Signature" },
    { name: "FinTech HQ", area: "450 מ״ר", style: "Premium" },
    { name: "Studio Loft", area: "180 מ״ר", style: "Classic" },
    { name: "Legal Partners", area: "260 מ״ר", style: "Signature" },
    { name: "Creative Agency", area: "210 מ״ר", style: "Classic" },
  ];
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="container-prose">
        <Reveal>
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">פרויקטים אחרונים</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              עבודה מדברת בעד עצמה
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.08}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-secondary border border-line card-hover">
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, #F8F9FC 0%, #EFF2F8 60%, #DBEAFE 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="text-xs text-primary-500 font-bold tracking-wider uppercase mb-1">
                    {p.style}
                  </div>
                  <div className="text-xl font-bold text-ink-primary mb-1">{p.name}</div>
                  <div className="text-sm text-ink-secondary">{p.area}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FAQ ─────────────────────────── */

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
    <section className="py-24 bg-surface-secondary border-t border-line">
      <div className="container-prose max-w-3xl">
        <Reveal>
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">שאלות נפוצות</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
              בלי קטנות
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 0.05}>
              <details className="group card p-6 cursor-pointer open:border-primary-500 open:shadow-card transition-all">
                <summary className="flex items-center justify-between gap-4 list-none">
                  <span className="text-base font-semibold text-ink-primary">{it.q}</span>
                  <span className="text-primary-500 text-2xl group-open:rotate-45 transition-transform duration-300 leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-ink-secondary leading-relaxed">{it.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA BOTTOM ─────────────────────────── */

function CtaBottom() {
  return (
    <section className="py-24 bg-white">
      <div className="container-prose max-w-3xl text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight mb-5">
            מוכן לראות מחיר?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-ink-secondary mb-10">
            שלוש דקות. אפס מחויבות. כל המידע שאתה צריך כדי להחליט.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link href="/auth" className="btn-primary">
            בחר את המשרד שלך
            <ArrowLeft />
          </Link>
          <p className="text-xs text-ink-secondary mt-6">
            חינם · ללא פגישה · ללא רישום אשראי
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── ICONS ─────────────────────────── */

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
