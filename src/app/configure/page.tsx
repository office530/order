import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";
import ConfigureForm from "@/components/configure/ConfigureForm";

export const metadata = {
  title: "פרטי המשרד | RNVT",
  description: "הזן שטח, אזור וקומה — וראה מחיר משוער בזמן אמת.",
};

export default function ConfigurePage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-surface-secondary">
        <ProgressBar current="configure" />

        <div className="container-prose pt-8 pb-10 text-center">
          <p className="eyebrow mb-3">שלב 3 מתוך 5</p>
          <h1 className="text-display-sm sm:text-display text-ink-primary tracking-tight mb-4">
            פרטי המשרד שלך
          </h1>
          <p className="text-lg text-ink-secondary max-w-2xl mx-auto">
            שטח, אזור, פרטי קשר — והמערכת תציג מחיר משוער מיידי.
          </p>
        </div>

        <div className="container-prose">
          <ConfigureForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
