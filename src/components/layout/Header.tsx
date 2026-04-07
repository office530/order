import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-20">
      <div className="container-prose flex items-center justify-between py-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-white">RNVT</span>
          <span className="text-gold">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#how" className="hover:text-white transition">
            איך זה עובד
          </Link>
          <Link href="/packages" className="hover:text-white transition">
            חבילות
          </Link>
          <Link href="#" className="hover:text-white transition">
            פרויקטים
          </Link>
          <Link href="#" className="hover:text-white transition">
            צור קשר
          </Link>
        </nav>

        <Link
          href="/auth"
          className="text-sm font-semibold text-ink-900 bg-gold hover:bg-gold-light transition px-5 py-2.5 rounded-full"
        >
          התחל עכשיו
        </Link>
      </div>
    </header>
  );
}
