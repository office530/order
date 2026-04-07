import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";

export const metadata = {
  title: "תודה! ההזמנה התקבלה | RNVT",
  description: "ההזמנה שלך התקבלה. צוות RNVT יצור איתך קשר תוך 48 שעות.",
};

interface PageProps {
  searchParams: { order?: string };
}

export default function SuccessPage({ searchParams }: PageProps) {
  const orderId = searchParams.order;

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-surface-secondary">
        <ProgressBar current="success" />

        <div className="container-prose pt-12 pb-24">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center animate-fade-up">
              <svg
                width="40"
                height="40"
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

            <p className="eyebrow mb-3">ההזמנה אושרה</p>
            <h1 className="text-display-sm sm:text-display text-ink-primary tracking-tight mb-4">
              תודה — שריינו לך מקום!
            </h1>
            <p className="text-lg text-ink-secondary max-w-2xl mx-auto mb-3">
              קיבלנו את המקדמה שלך ושריינו את תור הפרויקט בלוח הזמנים שלנו.
            </p>
            {orderId && (
              <p className="text-sm text-ink-secondary">
                מספר הזמנה: <span dir="ltr" className="font-mono font-semibold text-ink-primary">{orderId}</span>
              </p>
            )}
          </div>

          {/* What happens now */}
          <div className="max-w-2xl mx-auto card p-8 mb-10">
            <h2 className="text-xl font-bold text-ink-primary mb-6 text-center">
              מה קורה עכשיו?
            </h2>

            <ol className="space-y-5">
              <Step
                num="1"
                title="מייל אישור — תוך כמה דקות"
                body="תקבל אישור הזמנה במייל עם כל הפרטים. שמור אותו לעצמך."
              />
              <Step
                num="2"
                title="הסכם דיגיטלי — תוך 48 שעות"
                body="נשלח לך קישור לחתימה דיגיטלית על ההסכם המלא, עם כל הפרטים, לוחות הזמנים והאחריות."
              />
              <Step
                num="3"
                title="פגישת אפיון עם מנהל הפרויקט"
                body="מנהל הפרויקט יתאם איתך פגישה (פיזית או בזום) לאפיון מדויק של החלל והדרישות."
              />
              <Step
                num="4"
                title="התחלת העבודה"
                body="לאחר אישור התכנון — נכנסים לעבודה במועד שסוכם, עם דשבורד אונליין למעקב מלא."
              />
            </ol>
          </div>

          {/* Reassurance */}
          <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-primary-50 border border-primary-100 mb-10 text-center">
            <p className="text-sm text-primary-700">
              💙 משהו לא ברור? <span className="font-semibold">חייגו 03-1234567</span> או שלחו{" "}
              <a href="mailto:office@rnvt.co.il" className="font-semibold underline">
                מייל
              </a>{" "}
              — אנחנו כאן.
            </p>
            <p className="text-xs text-primary-700/70 mt-2">
              החזר מלא מובטח תוך 30 יום — ללא שאלות.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/" className="btn-ghost">
              ← חזרה לדף הבית
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Step({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center flex-shrink-0">
        {num}
      </div>
      <div>
        <div className="font-bold text-ink-primary mb-1">{title}</div>
        <div className="text-sm text-ink-secondary leading-relaxed">{body}</div>
      </div>
    </li>
  );
}
