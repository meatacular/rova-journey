'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PreferenceCenter } from '@/components/preferences/PreferenceCenter';
import { SettingsDrawer } from '@/components/settings/SettingsDrawer';

export default function PreferencesPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Your Journey</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Personalise your experience
            </p>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <PreferenceCenter />
      </div>
      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </AppShell>
  );
}
