import Link from "next/link";
import { logout } from "../login/actions";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream pb-20">
      <header className="flex items-center justify-between border-b border-gold-light/30 bg-white px-4 py-3">
        <h1 className="font-serif text-lg italic text-espresso">Cardamom Café — Admin</h1>
        <form action={logout}>
          <button type="submit" className="text-xs font-medium text-espresso-light underline">
            Log out
          </button>
        </form>
      </header>

      <main className="p-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 flex border-t border-gold-light/30 bg-white">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 py-3 text-center text-sm font-medium text-espresso-light hover:text-espresso"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
