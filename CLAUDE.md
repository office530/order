# פרומפט התחלתי ל-Claude Code — פלטפורמת הזמנת עבודות גמר למשרדים

## איך להשתמש
1. פתח Claude Code בטרמינל
2. צור תיקייה חדשה: `mkdir fitout-platform && cd fitout-platform`
3. שים את הקובץ `docs/spec.html` (מסמך האפיון שקיבלת) בתיקיית הפרויקט
4. העתק את הפרומפט למטה והדבק ב-Claude Code

---

## פרומפט שלב 1 — הקמת הפרויקט

```
קרא את הקובץ docs/spec.html — זה מסמך אפיון מלא של פלטפורמה להזמנת עבודות גמר למשרדים אונליין (בסגנון טסלה — לקוח בוחר חבילה, רואה מחיר, משלם מקדמה).

הקם פרויקט Next.js 14 (App Router) עם:

### טכנולוגיות
- Next.js 14 App Router (TypeScript)
- Tailwind CSS
- Supabase (auth + database)
- פונט Assistant מ-Google Fonts
- כל הדפים RTL עברית (dir="rtl", lang="he")

### מבנה תיקיות
```
src/
  app/
    page.tsx              ← דף נחיתה (Hero)
    auth/
      page.tsx            ← אימות טלפון OTP
    packages/
      page.tsx            ← בחירת חבילה (4 רמות)
    configure/
      page.tsx            ← הזנת פרטי משרד + חישוב מחיר
    checkout/
      page.tsx            ← דף סיכום + סליקה
    success/
      page.tsx            ← Thank You + מה עכשיו
    api/
      send-otp/route.ts   ← שליחת OTP
      verify-otp/route.ts  ← אימות OTP
      create-order/route.ts ← יצירת הזמנה
      payment/route.ts     ← webhook סליקה
  components/
    ui/                   ← כפתורים, אינפוטים, כרטיסים
    layout/
      Header.tsx
      Footer.tsx
      ProgressBar.tsx     ← מציג באיזה שלב הלקוח
    packages/
      PackageCard.tsx     ← כרטיס חבילה בודד
      PackageGrid.tsx     ← רשת 4 חבילות
    configure/
      AreaInput.tsx       ← הזנת שטח
      LocationSelect.tsx  ← בחירת אזור
      PriceCalculator.tsx ← חישוב מחיר בזמן אמת
  lib/
    supabase/
      client.ts
      server.ts
    packages.ts           ← הגדרות 4 חבילות
    pricing.ts            ← לוגיקת תמחור
    types.ts
  hooks/
    useOrder.ts           ← state של ההזמנה
docs/
  spec.html              ← מסמך האפיון
```

### Supabase Schema
צור קובץ supabase/migrations/001_initial.sql עם:

```sql
-- לקוחות
create table customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  company text,
  email text,
  created_at timestamptz default now()
);

-- חבילות (ESSENTIAL, CLASSIC, PREMIUM, SIGNATURE)
create table packages (
  id text primary key,
  name text not null,
  name_he text not null,
  price_per_sqm integer not null,
  features jsonb not null,
  sort_order integer not null
);

-- הזמנות
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  package_id text references packages(id),
  area_sqm integer not null,
  location text not null,
  floor integer,
  estimated_price integer not null,
  deposit_amount integer default 2000,
  deposit_paid boolean default false,
  payment_id text,
  contract_signed boolean default false,
  status text default 'pending' check (status in ('pending','paid','contract_sent','contract_signed','meeting_scheduled','active','cancelled','refunded')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- OTP sessions
create table otp_sessions (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code text not null,
  expires_at timestamptz not null,
  verified boolean default false,
  attempts integer default 0,
  created_at timestamptz default now()
);

-- RLS
alter table customers enable row level security;
alter table orders enable row level security;
alter table otp_sessions enable row level security;

-- Seed packages
insert into packages (id, name, name_he, price_per_sqm, features, sort_order) values
('signature', 'SIGNATURE', 'סיגנצ׳ר', 5000, '{"design":"עיצוב אדריכלי מלא","materials":"חומרים ברמה גבוהה","lighting":"תאורה מעצבת","partition":"חלוקה פנימית מלאה","systems":"מערכות מלאות","warranty":"24 חודש","management":"מנהל פרויקט צמוד"}', 1),
('premium', 'PREMIUM', 'פרימיום', 4000, '{"design":"עיצוב אדריכלי בסיסי","materials":"חומרים ברמה בינונית","lighting":"תאורה מעצבת","partition":"חלוקה פנימית","systems":"מערכות מלאות","warranty":"18 חודש","management":"מנהל פרויקט צמוד"}', 2),
('classic', 'CLASSIC', 'קלאסיק', 3500, '{"design":"תכנון פנימי","materials":"חומרים איכותיים","lighting":"תאורה סטנדרטית","partition":"חלוקה פנימית","systems":"מערכות חלקיות","warranty":"12 חודש","management":"ליווי פרויקט"}', 3),
('essential', 'ESSENTIAL', 'אסנשיאל', 3000, '{"design":"תכנון סטנדרטי","materials":"חומרים סטנדרטיים","lighting":"תאורה בסיסית","partition":"ללא חלוקה","systems":"מערכות בסיסיות","warranty":"12 חודש","management":"ליווי פרויקט"}', 4);
```

### עיצוב
- רקע כהה (#0a0a0a) עם אקסנטים בזהב (#c8a96e)
- מינימליסטי ונקי, לא Wix
- Mobile First
- אנימציות עדינות (framer-motion)
- כל הטקסט RTL

### הנחיות חשובות
- אל תבנה את כל הדפים עכשיו — בנה רק את המבנה, ה-layout, וה-schema
- הדף הראשון שצריך לעבוד מקצה לקצה הוא דף הנחיתה (page.tsx)
- השאר רק שלד בסיסי עם כיתוב "בקרוב"
- צור קובץ .env.local.example עם כל המשתנים הנדרשים
- צור README.md עם הוראות התקנה
```

---

## פרומפט שלב 2 — דף נחיתה

```
תקרא את docs/spec.html חלק 2 (שלב 1: דף נחיתה).
בנה את דף הנחיתה (src/app/page.tsx) עם:

1. Hero section עם רקע וידאו/תמונה כהה
   - כותרת: "המשרד שלך, מוכן להזמנה"
   - תת-כותרת: "בחר חבילה, ראה מפרט, שלם מקדמה – ואנחנו נעשה את השאר"
   - CTA כפתור זהב: "בחר את המשרד שלך"

2. בנר הטבה בראש: "30,000₪ הנחה למזמינים דרך האתר" עם טיימר

3. סקציית מספרים: 126 פרויקטים | 220,000 מ״ר | דירוג 4.9

4. סקציית גלריה: 4-6 כרטיסי פרויקט (placeholder תמונות)

5. סקציית "איך זה עובד" — 4 שלבים אייקונים

6. סקציית FAQ

7. CTA תחתון

העיצוב: כהה, מינימלי, זהב. אנימציות כניסה עם framer-motion.
Mobile first. כל הטקסט RTL.
```

---

## פרומפט שלב 3 — אימות OTP

```
תקרא את docs/spec.html חלק 2 (שלב 2: אימות טלפון).
בנה את מסך האימות (src/app/auth/page.tsx) + API routes:

1. מסך נקי עם שדה טלפון ישראלי (05X-XXXXXXX)
2. כפתור "שלח קוד אימות"
3. מסך הזנת קוד (4-6 ספרות) עם טיימר 5 דקות
4. Rate limiting: מקסימום 3 ניסיונות בשעה למספר
5. אחרי אימות מוצלח — redirect ל-/packages

API routes:
- POST /api/send-otp — שומר ב-Supabase, מחזיר success (בשלב זה בלי SMS אמיתי — פשוט log את הקוד לconsole)
- POST /api/verify-otp — בודק קוד, מסמן verified

לאחר מכן נחבר Twilio/InforuMobile. בינתיים הקוד תמיד 1234.
```

---

## פרומפט שלב 4 — בחירת חבילה

```
תקרא את docs/spec.html חלק 2 (שלב 3: בחירת חבילה).
בנה את מסך בחירת החבילה (src/app/packages/page.tsx):

1. 4 כרטיסי חבילה זה ליד זה (grid responsive)
   - SIGNATURE (₪5,000/מ״ר) — זהב/מודגש
   - PREMIUM (₪4,000/מ״ר)
   - CLASSIC (₪3,500/מ״ר) — badge "הכי פופולרי"
   - ESSENTIAL (₪3,000/מ״ר)

2. כל כרטיס מציג:
   - שם + מחיר למ״ר
   - רשימת features מה-DB
   - תמונת placeholder (render של משרד)
   - כפתור "בחר חבילה"

3. בלחיצה — שומר ב-state (zustand/context) ועובר ל-/configure

4. SIGNATURE מוצג ראשון (anchor pricing)
5. CLASSIC מקבל highlight כ"מומלץ"

טען את החבילות מ-Supabase (טבלת packages).
```

---

## פרומפט שלב 5 — הגדרת משרד + חישוב מחיר

```
תקרא את docs/spec.html חלק 2 (שלב 4: הזנת פרטי המשרד).
בנה את src/app/configure/page.tsx:

1. שדה שטח (מ״ר ברוטו) — slider + input
2. בחירת אזור — מרכז / שרון / צפון (radio buttons)
3. בחירת קומה (optional)
4. שם חברה + איש קשר

5. חישוב מחיר בזמן אמת:
   - מחיר = שטח × מחיר_למטר
   - אנימציה של הסכום שעולה
   - "מחיר משוער: ₪XXX,XXX"
   - "זמן ביצוע משוער: XX-XX יום"

6. כפתור "המשך לסיכום" → /checkout

המחיר מחושב client-side מהנתונים שכבר נטענו.
```

---

## פרומפט שלב 6 — סיכום + סליקה

```
תקרא את docs/spec.html חלק 2 (שלב 5+6: דף סיכום + סליקה + הסכם).
בנה את src/app/checkout/page.tsx:

1. סיכום ההזמנה:
   - חבילה שנבחרה + מפרט מקוצר
   - שטח + מיקום + קומה
   - מחיר משוער (גדול ובולט)
   - שורת הטבה: "בהזמנה אונליין אתה חוסך ₪30,000" עם מחיר מקורי חצוי

2. אלמנטי אמון:
   - "מקדמה ₪2,000 בלבד — החזר מלא אם לא מתקדם"
   - "12+ חודשי אחריות"
   - "85 לקוחות הזמינו החודש"

3. כפתור "שריין מקום — ₪2,000"
   - בשלב זה: placeholder לסליקה (מדמה תשלום מוצלח)
   - בהמשך: חיבור ל-Meshulam/CardCom API

4. אחרי "תשלום":
   - POST /api/create-order — שומר הזמנה ב-DB
   - redirect ל-/success

5. דף success:
   - "ההזמנה שלך אושרה!"
   - מה קורה עכשיו: מייל אישור → הסכם → פגישת אפיון
   - כפתור "חזור לדף הבית"
```

---

## משתני סביבה (.env.local.example)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# SMS/OTP (להוסיף בהמשך)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# סליקה (להוסיף בהמשך)
MESHULAM_API_KEY=
MESHULAM_PAGE_CODE=

# כללי
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEPOSIT_AMOUNT=2000
ONLINE_DISCOUNT=30000
```

---

## סדר עבודה מומלץ

| שלב | מה | זמן משוער |
|------|------|-------------|
| 1 | הקמת פרויקט + schema + layout | שעה |
| 2 | דף נחיתה מעוצב | שעה-שעתיים |
| 3 | אימות OTP (mock) | חצי שעה |
| 4 | בחירת חבילה | שעה |
| 5 | הגדרת משרד + מחשבון | שעה |
| 6 | סיכום + סליקה (mock) | שעה |
| 7 | חיבור SMS אמיתי | חצי שעה |
| 8 | חיבור סליקה אמיתית | שעה-שעתיים |
| 9 | הסכם דיגיטלי | שעה |
| 10 | Deploy (Vercel) | חצי שעה |
