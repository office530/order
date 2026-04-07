"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const NAV = [
  { href: "/admin", label: "לוח בקרה" },
  { href: "/admin/orders", label: "הזמנות" },
];

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <header className="bg-white border-b border-line sticky top-0 z-20">
        <div className="container-prose flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-extrabold tracking-tight text-ink-primary">
              RNVT<span className="text-primary-500">.</span>
              <span className="text-xs font-semibold text-ink-secondary mr-2">admin</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "font-medium transition",
                      active
                        ? "text-primary-500"
                        : "text-ink-secondary hover:text-ink-primary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-ink-secondary hover:text-danger font-medium transition"
          >
            התנתק
          </button>
        </div>
      </header>

      <main className="container-prose py-10">{children}</main>
    </div>
  );
}
