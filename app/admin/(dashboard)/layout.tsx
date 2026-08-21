"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import DiamondLattice from "@/components/motion/DiamondLattice";
import { logout } from "../login/actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/orders", label: t("admin.nav.orders") },
    { href: "/admin/menu", label: t("admin.nav.menu") },
    { href: "/admin/settings", label: t("admin.nav.settings") },
  ];

  return (
    <div className="relative min-h-dvh bg-cream pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
        <DiamondLattice count={8} intensity={0.4} seed={3} />
      </div>

      <header className="relative flex items-center justify-between border-b border-gold/20 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/brand/sultana-logo-icon.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <h1 className="whitespace-nowrap font-serif text-lg italic text-navy">{t("admin.dashboardTitle")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle variant="light" />
          <form action={logout}>
            <button type="submit" className="-my-2 flex min-h-11 items-center px-1 text-xs font-medium text-navy/60 underline">
              {t("admin.logout")}
            </button>
          </form>
        </div>
      </header>

      <main className="relative p-4">{children}</main>

      <Footer variant="light" />

      <nav className="fixed inset-x-0 bottom-0 flex border-t border-gold/20 bg-white">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-3 text-center text-sm font-medium transition ${
                active ? "text-gold" : "text-navy/60 hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
