import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cardamom Café",
  description: "Scan, browse, order — Cardamom Café's QR menu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-espresso font-sans">{children}</body>
    </html>
  );
}
