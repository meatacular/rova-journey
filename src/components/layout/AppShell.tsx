'use client';

import { Header } from './Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-8 pt-6">{children}</main>
    </div>
  );
}
