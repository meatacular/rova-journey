'use client';

import { AppShell } from '@/components/layout/AppShell';
import { JourneyPlayer } from '@/components/journey/JourneyPlayer';

export default function JourneyPage() {
  return (
    <AppShell>
      <JourneyPlayer />
    </AppShell>
  );
}
