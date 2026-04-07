import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";
import PackageGrid from "@/components/packages/PackageGrid";
import { loadPackages } from "@/lib/packages-loader";

export const metadata = {
  title: "בחירת חבילה | RNVT",
  description: "בחר את החבילה שמתאימה למשרד שלך — ESSENTIAL, CLASSIC, PREMIUM או SIGNATURE.",
};

export default async function PackagesPage() {
  const packages = await loadPackages();

  return (
    <div className="pb-24">
      <Header />
      <main className="min-h-[80vh] bg-surface-secondary">
        <ProgressBar current="packages" />

        <div className="container-prose pt-8 pb-12 text-center">
          <p className="eyebrow mb-3">שלב 2 מתוך 5</p>
          <h1 className="text-display-sm sm:text-display text-ink-primary tracking-tight mb-4">
            בחר את החבילה שלך
          </h1>
          <p className="text-lg text-ink-secondary max-w-2xl mx-auto">
            ארבע רמות, שקיפות מלאה. כל חבילה כוללת חומרים, עבודות ואחריות —
            תוכל לראות בדיוק מה מקבלים.
          </p>
        </div>

        <div className="container-prose">
          <PackageGrid packages={packages} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
