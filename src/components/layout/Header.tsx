import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 inset-x-0 z-30 bg-paper/85 backdrop-blur-md border-b border-line">
      <div className="container-prose flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-serif text-2xl font-medium tracking-tight text-ink-primary leading-none"
        >
          RNVT<span className="text-primary-500">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-secondary">
          <Link href="#how" className="hover:text-ink-primary transition">
            איך זה עובד
          </Link>
          <Link href="/packages" className="hover:text-ink-primary transition">
            חבילות
          </Link>
          <Link href="#projects" className="hover:text-ink-primary transition">
            פרויקטים
          </Link>
          <Link href="#contact" className="hover:text-ink-primary transition">
            צור קשר
          </Link>
        </nav>

        <Link
          href="/auth"
          className="text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition px-4 py-2 rounded-lg"
        >
          התחל עכשיו
        </Link>
      </div>
    </header>
  );
}
