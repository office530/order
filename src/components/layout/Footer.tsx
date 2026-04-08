import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-paper py-20">
      <div className="container-prose">
        <div className="mb-16">
          <Link
            href="/"
            className="font-serif text-7xl sm:text-8xl font-light tracking-tight text-ink-primary leading-none inline-block"
          >
            RNVT<span className="text-primary-500">.</span>
          </Link>
          <p className="text-ink-secondary max-w-md leading-relaxed mt-4">
            פלטפורמת עבודות גמר למשרדים אונליין.
            <br />
            בחר חבילה, ראה מחיר, התחל פרויקט — בלי פגישות מיותרות.
          </p>
        </div>

        <div className="arch-rule mb-12" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
          <FooterColumn title="מוצר">
            <FooterLink href="/packages">חבילות</FooterLink>
            <FooterLink href="/configure">חישוב מחיר</FooterLink>
            <FooterLink href="/#how">איך זה עובד</FooterLink>
          </FooterColumn>
          <FooterColumn title="חברה">
            <FooterLink href="#">אודות</FooterLink>
            <FooterLink href="/#projects">פרויקטים</FooterLink>
            <FooterLink href="#">צור קשר</FooterLink>
          </FooterColumn>
          <FooterColumn title="משפטי">
            <FooterLink href="#">תנאי שימוש</FooterLink>
            <FooterLink href="#">פרטיות</FooterLink>
            <FooterLink href="#">אחריות</FooterLink>
          </FooterColumn>
          <FooterColumn title="צור קשר">
            <FooterLink href="tel:031234567">03-1234567</FooterLink>
            <FooterLink href="mailto:office@rnvt.co.il">office@rnvt.co.il</FooterLink>
          </FooterColumn>
        </div>

        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-secondary">
          <div>© {year} רנובייט בע״מ · כל הזכויות שמורות</div>
          <div className="font-serif text-sm">תל אביב · ירושלים · חיפה</div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-ink-secondary uppercase tracking-[0.25em] mb-5">
        {title}
      </div>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-ink-primary hover:text-primary-500 transition"
      >
        {children}
      </Link>
    </li>
  );
}
