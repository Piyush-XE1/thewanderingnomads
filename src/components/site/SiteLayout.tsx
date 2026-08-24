import type { ReactNode } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

export function SiteLayout({
  children,
  extra,
  hideWhatsApp = false,
}: {
  children: ReactNode;
  extra?: ReactNode;
  hideWhatsApp?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {children}
      {extra}
      <Footer />
      {hideWhatsApp ? null : <FloatingWhatsApp />}
    </div>
  );
}
