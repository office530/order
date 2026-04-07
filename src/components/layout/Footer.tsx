import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface-secondary py-16">
      <div className="container-prose">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight inline-block mb-4 text-ink-primary">
              RNVT<span className="text-primary-500">.</span>
            </Link>
            <p className="text-ink-secondary max-w-md leading-relaxed">
              פלטפורמת עבודות גמר למשרדים אונליין. בחר חבילה, ראה מחיר, התחל פרויקט — בלי
              פגישות מיותרות.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-ink-primary mb-4">מוצר</div>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li><Link href="/packages" className="hover:text-primary-500 transition">חבילות</Link></li>
              <li><Link href="/configure" className="hover:text-primary-500 transition">חישוב מחיר</Link></li>
              <li><Link href="#how" className="hover:text-primary-500 transition">איך זה עובד</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-ink-primary mb-4">חברה</div>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li><Link href="#" className="hover:text-primary-500 transition">אודות</Link></li>
              <li><Link href="#" className="hover:text-primary-500 transition">פרויקטים</Link></li>
              <li><Link href="#" className="hover:text-primary-500 transition">צור קשר</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-secondary">
          <div>© {year} רנובייט בע״מ · כל הזכויות שמורות</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary-500 transition">תנאי שימוש</Link>
            <Link href="#" className="hover:text-primary-500 transition">פרטיות</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
