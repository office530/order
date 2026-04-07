# Order — פלטפורמת עבודות גמר למשרדים אונליין

> "The Tesla Model for Office Fit-Out"
> בחר חבילה, ראה מחיר אמיתי, שלם מקדמה — והפרויקט מתחיל.

פלטפורמה שמאפשרת ללקוחות עסקיים להזמין שיפוץ משרד אונליין מקצה לקצה — בחירת
חבילה, חישוב מחיר בזמן אמת, סליקת מקדמה וחתימת חוזה — בלי פגישות מקדימות.

---

## 📋 סטטוס

| שלב | מצב |
| --- | --- |
| 1. הקמת פרויקט + מבנה + schema | ✅ הושלם |
| 2. דף נחיתה (Hero) | ✅ הושלם |
| 3. אימות OTP | 🔜 בקרוב |
| 4. בחירת חבילה | 🔜 בקרוב |
| 5. הזנת פרטים + חישוב מחיר | 🔜 בקרוב |
| 6. סיכום + סליקה (mock) | 🔜 בקרוב |
| 7. אינטגרציית SMS אמיתית | 🔜 בקרוב |
| 8. אינטגרציית סליקה אמיתית | 🔜 בקרוב |
| 9. דשבורד אדמין | 🔜 בקרוב |
| 10. Deploy ל-Vercel | 🔜 בקרוב |

המסמך המלא של האפיון נמצא ב-[`docs/spec.html`](./docs/spec.html).
פרומפטים לבנייה הדרגתית עם Claude Code נמצאים ב-[`CLAUDE.md`](./CLAUDE.md).

---

## 🛠️ Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + פונט Assistant מ-Google Fonts
- **Database / Auth:** Supabase
- **State:** Zustand (client-side order draft)
- **Animations:** Framer Motion (יתווסף בהמשך)
- **כיווניות:** RTL עברית בלבד

---

## 🚀 התקנה

### 1. התקן תלויות

```bash
npm install
```

### 2. הגדר Supabase

1. צור פרויקט חדש ב-[supabase.com](https://supabase.com)
2. הרץ את המיגרציה:
   ```bash
   # אפשרות א — Supabase CLI
   supabase db push

   # אפשרות ב — הדבק ידנית את התוכן של supabase/migrations/001_initial.sql
   #            ב-SQL Editor של הדשבורד
   ```
3. העתק את ה-URL וה-anon key מ-Project Settings → API

### 3. הגדר משתני סביבה

```bash
cp .env.local.example .env.local
```

ערוך את `.env.local` ומלא לפחות:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. הרץ את הפרויקט

```bash
npm run dev
```

הפרויקט ירוץ ב-[http://localhost:3000](http://localhost:3000)

---

## 📂 מבנה הפרויקט

```
src/
  app/
    page.tsx              ← ✅ דף נחיתה (Hero) — מלא
    layout.tsx            ← RTL + פונט Assistant + metadata
    globals.css           ← Tailwind + theme dark/gold
    auth/                 ← 🔜 OTP
    packages/             ← 🔜 בחירת חבילה
    configure/            ← 🔜 פרטי משרד + חישוב
    checkout/             ← 🔜 סליקה
    success/              ← 🔜 thank you
    api/
      send-otp/           ← 🔜 stub
      verify-otp/         ← 🔜 stub
      create-order/       ← 🔜 stub
      payment/            ← 🔜 stub (webhook)
  components/
    ui/Button.tsx
    layout/
      Header.tsx
      Footer.tsx
      ProgressBar.tsx
      ComingSoon.tsx
    packages/
      PackageCard.tsx     ← stub
      PackageGrid.tsx     ← stub
    configure/
      AreaInput.tsx       ← stub
      LocationSelect.tsx  ← stub
      PriceCalculator.tsx ← stub
  lib/
    types.ts              ← TypeScript types (Package, Order, ...)
    packages.ts           ← הגדרת 4 חבילות (mirror של DB)
    pricing.ts            ← לוגיקת תמחור + format שקלים
    supabase/
      client.ts           ← browser client
      server.ts           ← server-side client (App Router)
  hooks/
    useOrder.ts           ← Zustand store של ההזמנה הנוכחית
supabase/
  migrations/
    001_initial.sql       ← schema + seed של 4 חבילות
docs/
  spec.html               ← מסמך אפיון מלא
CLAUDE.md                 ← פרומפטים לבנייה הדרגתית עם Claude Code
```

---

## 🎨 עיצוב

- **רקע:** `#0a0a0a` (ink-900)
- **טקסט:** לבן + 60–70% opacity לטקסט משני
- **אקסנט:** זהב `#c8a96e` (gold)
- **פונט:** Assistant מ-Google Fonts (300–800)
- **גישה:** Mobile First, RTL מלא

---

## 📝 פיתוח

```bash
npm run dev          # פיתוח
npm run build        # build לפרודקשן
npm run start        # הרצת build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

---

## 📜 רישיון

פרטי — © רנובייט בע״מ
