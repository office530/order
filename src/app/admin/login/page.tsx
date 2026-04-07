import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { adminConfigured, isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = {
  title: "התחברות מנהל | RNVT",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) {
    redirect("/admin");
  }

  if (!adminConfigured()) {
    return (
      <main className="min-h-screen bg-surface-secondary flex items-center justify-center p-6">
        <div className="card p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-ink-primary mb-2">
            ⚙️ אזור המנהל לא מוגדר
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            הוסף את המשתנה הבא ל-<code className="font-mono text-xs bg-surface-secondary px-1.5 py-0.5 rounded">.env.local</code>:
          </p>
          <pre className="mt-4 text-xs text-left bg-ink-primary text-white p-3 rounded-lg" dir="ltr">
            ADMIN_PASSWORD=choose-a-strong-password
          </pre>
          <p className="text-xs text-ink-secondary mt-4">
            ולאחר מכן הפעל מחדש את שרת הפיתוח.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-secondary flex items-center justify-center p-6">
      <AdminLoginForm />
    </main>
  );
}
