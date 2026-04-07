import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-700 bg-ink-900 py-16">
      <div className="container-prose">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight inline-block mb-4">
              <span className="text-white">RNVT</span>
              <span className="text-gold">.</span>
            </Link>
            <p className="text-white/50 max-w-md leading-relaxed">
              פלטפורמת עבודות גמר למשרדים אונליין. בחר חבילה, ראה מחיר, התחל פרויקט — בלי
              פגישות מיותרות.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-white mb-4">מוצר</div>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/packages" className="hover:text-gold transition">חבילות</Link></li>
              <li><Link href="/configure" className="hover:text-gold transition">חישוב מחיר</Link></li>
              <li><Link href="#how" className="hover:text-gold transition">איך זה עובד</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white mb-4">חברה</div>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="#" className="hover:text-gold transition">אודות</Link></li>
              <li><Link href="#" className="hover:text-gold transition">פרויקטים</Link></li>
              <li><Link href="#" className="hover:text-gold transition">צור קשר</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© {year} רנובייט בע״מ · כל הזכויות שמורות</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gold transition">תנאי שימוש</Link>
            <Link href="#" className="hover:text-gold transition">פרטיות</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
