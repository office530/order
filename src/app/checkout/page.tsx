import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export const metadata = {
  title: "סיכום ותשלום | RNVT",
  description: "סקור את סיכום ההזמנה ושריין את התור עם מקדמה ‎₪2,000.",
};

const ERROR_MESSAGES: Record<string, string> = {
  cancelled: "הסליקה בוטלה. אפשר לנסות שוב כשתרצה.",
  failed: "הסליקה לא הצליחה. בדוק את פרטי הכרטיס ונסה שוב.",
  missing_order: "חסרים פרטי הזמנה. התחל מחדש.",
};

interface PageProps {
  searchParams: { error?: string };
}

export default function CheckoutPage({ searchParams }: PageProps) {
  const errorMessage = searchParams.error
    ? ERROR_MESSAGES[searchParams.error] ?? "אירעה שגיאה. נסה שוב."
    : null;

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-surface-secondary">
        <ProgressBar current="checkout" />

        <div className="container-prose pt-8 pb-10 text-center">
          <p className="eyebrow mb-3">שלב 4 מתוך 5</p>
          <h1 className="text-display-sm sm:text-display text-ink-primary tracking-tight mb-4">
            סיכום וביצוע
          </h1>
          <p className="text-lg text-ink-secondary max-w-2xl mx-auto">
            סקור את הפרטים, ושריין את התור עם מקדמה של ‎₪2,000.
          </p>
        </div>

        {errorMessage && (
          <div className="container-prose mb-6">
            <div className="card p-4 border-danger/30 bg-danger/5 text-sm text-danger text-center">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="container-prose">
          <CheckoutSummary />
        </div>
      </main>
      <Footer />
    </>
  );
}
