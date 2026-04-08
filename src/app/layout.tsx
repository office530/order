import type { Metadata } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-assistant",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "המשרד שלך, מוכן באונליין | פלטפורמת עבודות גמר למשרדים",
  description:
    "בחר חבילה, ראה מחיר, שלם מקדמה — וקבל את המשרד שלך מוכן. עיצוב, חומרים, תאורה, חלוקה ומערכות — הכל באונליין.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "המשרד שלך, מוכן באונליין",
    description:
      "פעם ראשונה במשרדים — אונליין מקצה לקצה. בחר חבילה, ראה מחיר, התחל פרויקט.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${frankRuhl.variable}`}
    >
      <body className="font-sans antialiased bg-paper text-ink-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
