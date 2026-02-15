'use client';

import { AppShell } from '@/components/layout/AppShell';
import { PreferenceCenter } from '@/components/preferences/PreferenceCenter';

export default function PreferencesPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Your Journey</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalise your experience
          </p>
        </div>
        <PreferenceCenter />
      </div>
    </AppShell>
  );
}
