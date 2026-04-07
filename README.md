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
| 3. אימות OTP | ✅ הושלם |
| 4. בחירת חבילה | ✅ הושלם |
| 5. הזנת פרטים + חישוב מחיר | ✅ הושלם |
| 6. סיכום + סליקה (mock) | ✅ הושלם |
| 7. אינטגרציית SMS (Inforu / Twilio) | ✅ הושלם |
| 8. אינטגרציית סליקה (Meshulam / CardCom) | ✅ הושלם |
| 9. דשבורד אדמין | 🔜 בקרוב |
| 10. Deploy ל-Vercel | 🔜 בקרוב |

### חיבור SMS אמיתי (אופציונלי — עובד גם בלי)

ברירת מחדל: ה-OTP מודפס ל-console של `npm run dev`. מספיק לפיתוח.
לחיבור ספק אמיתי, מלא אחד מהשניים ב-`.env.local`:

**InforuMobile (מומלץ לישראל):**
```env
INFORU_USERNAME=your_username
INFORU_API_TOKEN=your_token
INFORU_SENDER=RNVT
```

**Twilio (גלובלי):**
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

המערכת בוחרת ספק אוטומטית. אפשר גם לאלץ עם `SMS_PROVIDER=inforu|twilio|console`.

### חיבור סליקה אמיתית (אופציונלי — עובד גם בלי)

ברירת מחדל: סליקה במצב **mock** — לחיצה על "שריין מקום" מסמנת את ההזמנה כשולמה
מיידית ועוברת ל-`/success`. מספיק לפיתוח ולדמואים.

לחיבור gateway אמיתי, מלא ב-`.env.local`:

**Meshulam Grow:**
```env
MESHULAM_USER_ID=...
MESHULAM_PAGE_CODE=...
MESHULAM_API_KEY=...
MESHULAM_TEST=1   # להסיר בפרודקשן
```

**CardCom (LowProfile v11):**
```env
CARDCOM_TERMINAL=...
CARDCOM_USERNAME=...
CARDCOM_API_PASSWORD=...
```

זרימה אמיתית: צד-לקוח קורא ל-`/api/payment/init` → השרת יוצר עמוד תשלום באתר הספק
ומחזיר URL → הדפדפן מנותב לשם → לאחר התשלום הספק מבצע POST ל-`/api/payment` (webhook)
ומחזיר את הלקוח ל-`/api/payment/return?order=...` שמוודא תשלום ומעביר ל-`/success`.

חשוב להגדיר `NEXT_PUBLIC_SITE_URL` לכתובת חיצונית מלאה (כמו `https://order.rnvt.co.il`)
כדי שה-return וה-webhook URLs יהיו תקינים מחוץ ל-localhost.

> ⚠️ הסכימות של Meshulam ו-CardCom נכתבו לפי התיעוד הציבורי שלהם, אבל לפני העלאה
> לפרודקשן מומלץ לבדוק את הזרימה מקצה לקצה עם credentials של סביבת test —
> פרטי שדות עלולים להשתנות בין גרסאות API.

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
