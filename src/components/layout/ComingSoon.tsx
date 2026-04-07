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
      <main className="min-h-[80vh] pt-32">
        <ProgressBar current={currentStep} />
        <div className="container-prose text-center py-24">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
            <span className="accent-line" />
            בקרוב
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">{title}</h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">{subtitle}</p>
          <Link href="/" className="btn-ghost">
            ← חזרה לדף הבית
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
