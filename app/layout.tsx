import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import LenisProvider from "@/components/motion/LenisProvider";

export const metadata: Metadata = {
  title: "Sultana Restocafe",
  description: "سلطانة — Scan, browse, order",
  icons: { icon: "/brand/sultana-logo-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-cream text-navy font-sans">
        <div className="paper-grain pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
        <LocaleProvider>
          <LenisProvider>{children}</LenisProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
