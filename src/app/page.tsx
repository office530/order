import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Gallery />
        <Faq />
        <CtaBottom />
      </main>
      <Footer />
    </>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient + grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-[#1a1410] to-ink-900" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[120%] h-[120%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,169,110,0.15) 0%, transparent 60%)",
        }}
      />

      {/* Top discount bar */}
      <div className="absolute top-24 inset-x-0 flex justify-center z-10 px-4">
        <div className="card-dark px-5 py-2 text-sm text-gold-light flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
          הזמנה אונליין: הנחת מקדמה של ‎₪30,000 על פרויקטים שנפתחים השבוע
        </div>
      </div>

      <div className="container-prose relative z-10 text-center pt-32 pb-20">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6 opacity-90">
          The Tesla Model for Office Fit-Out
        </p>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
          המשרד שלך,
          <br />
          <span className="text-gold">מוכן באונליין.</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          בחר חבילה, ראה מחיר אמיתי, שלם מקדמה — והפרויקט מתחיל.
          <br className="hidden sm:block" />
          ללא פגישות, ללא הצעות מחיר אינסופיות, ללא הפתעות.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth" className="btn-primary">
            בנה את המשרד שלך
            <ArrowLeft />
          </Link>
          <Link href="#how" className="btn-ghost">
            איך זה עובד
          </Link>
        </div>

        <p className="text-xs text-white/40 mt-8">
          ההצעה תקפה למעט ‎14 ימים · מקדמה של ‎₪2,000 בלבד · החזר מלא אם לא מתאים
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
      </div>
    </section>
  );
}

/* ───────────────────────── STATS ───────────────────────── */

function Stats() {
  const items = [
    { value: "126", label: "פרויקטים שהושלמו" },
    { value: "220,000", label: 'מ"ר שעוצבו' },
    { value: "4.9", label: "דירוג ממוצע (מתוך 5)" },
  ];
  return (
    <section className="border-y border-ink-700 bg-ink-800/50">
      <div className="container-prose py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="text-5xl sm:text-6xl font-extrabold text-gold mb-2 tracking-tight">
                {it.value}
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── HOW IT WORKS ───────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "אמת את הטלפון שלך",
      body: "הזנה מהירה של מספר טלפון וקוד SMS. שניות.",
    },
    {
      n: "02",
      title: "בחר חבילה",
      body: "ארבע רמות, מאסנשיאל ועד סיגנצ׳ר. כל מה שכלול שקוף לחלוטין.",
    },
    {
      n: "03",
      title: "הזן פרטי משרד",
      body: 'שטח במ"ר, אזור, קומה — והמערכת מציגה לך מחיר אמיתי בזמן אמת.',
    },
    {
      n: "04",
      title: "שלם מקדמה והתחל",
      body: "מקדמה של ‎₪2,000 סוגרת לך מקום. אם לא מתאים — החזר מלא.",
    },
  ];
  return (
    <section id="how" className="py-24">
      <div className="container-prose">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            <span className="accent-line" />
            ארבעה צעדים
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            ככה זה עובד
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="card-dark p-8 hover:border-gold/40 transition-all duration-300"
            >
              <div className="text-gold text-sm font-semibold mb-4 tracking-wider">{s.n}</div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-white/60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── GALLERY ───────────────────────── */

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
    <section className="py-24 bg-ink-800/30">
      <div className="container-prose">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            <span className="accent-line" />
            פרויקטים אחרונים
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            עבודה מדברת בעד עצמה
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.name}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-ink-700 to-ink-800 border border-ink-700"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/20 to-transparent" />
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(200,169,110,0.2), transparent 70%)",
                }}
              />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="text-xs text-gold tracking-wider uppercase mb-1">{p.style}</div>
                <div className="text-2xl font-bold mb-1">{p.name}</div>
                <div className="text-sm text-white/60">{p.area}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

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
    <section className="py-24">
      <div className="container-prose max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
            <span className="accent-line" />
            שאלות נפוצות
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">בלי קטנות</h2>
        </div>

        <div className="space-y-4">
          {items.map((it) => (
            <details
              key={it.q}
              className="group card-dark p-6 cursor-pointer open:border-gold/40 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 list-none">
                <span className="text-lg font-semibold">{it.q}</span>
                <span className="text-gold text-2xl group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              <p className="mt-4 text-white/70 leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA BOTTOM ───────────────────────── */

function CtaBottom() {
  return (
    <section className="py-24 bg-gradient-to-b from-ink-900 to-[#1a1410]">
      <div className="container-prose max-w-3xl text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          מוכן לראות מחיר?
        </h2>
        <p className="text-lg text-white/60 mb-10">
          שלוש דקות. אפס מחויבות. כל המידע שאתה צריך כדי להחליט.
        </p>
        <Link href="/auth" className="btn-primary">
          התחל עכשיו
          <ArrowLeft />
        </Link>
        <p className="text-xs text-white/40 mt-6">חינם · ללא פגישה · ללא רישום אשראי</p>
      </div>
    </section>
  );
}

/* ───────────────────────── ICONS ───────────────────────── */

function ArrowLeft() {
  return (
    <svg
      width="20"
      height="20"
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
