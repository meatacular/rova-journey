'use client';

import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-24 pt-6">{children}</main>
      <MobileNav />
    </div>
  );
}
