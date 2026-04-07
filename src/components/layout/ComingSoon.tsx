import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import ProgressBar from "./ProgressBar";

type Step = "auth" | "packages" | "configure" | "checkout" | "success";

interface Props {
  title: string;
  subtitle: string;
  currentStep: Step;
}

export default function ComingSoon({ title, subtitle, currentStep }: Props) {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-surface-secondary">
        <ProgressBar current={currentStep} />
        <div className="container-prose text-center pt-12 pb-24">
          <p className="eyebrow mb-4">בקרוב</p>
          <h1 className="text-display-sm sm:text-display text-ink-primary tracking-tight mb-5">
            {title}
          </h1>
          <p className="text-lg text-ink-secondary max-w-xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
          <Link href="/" className="btn-ghost">
            ← חזרה לדף הבית
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
