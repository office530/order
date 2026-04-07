import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "אימות טלפון | RNVT",
  description: "אמת את הטלפון שלך כדי להתחיל לבחור חבילה.",
};

export default function AuthPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-surface-secondary">
        <ProgressBar current="auth" />
        <div className="container-prose pt-8 pb-24">
          <AuthForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
