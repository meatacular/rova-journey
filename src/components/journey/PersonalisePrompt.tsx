'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { SegmentType } from '@/lib/types';
import { SettingsDrawer, SettingsSection } from '@/components/settings/SettingsDrawer';
import { cn } from '@/lib/utils';

const prompts: Partial<Record<SegmentType, { message: string; section: SettingsSection }>> = {
  traffic: { message: 'Want traffic for a specific route? Set your commute', section: 'traffic' },
  weather: { message: 'Set your city for local forecasts', section: 'weather' },
  news: { message: 'Choose your news categories', section: 'news' },
  sport: { message: 'Pick your favourite sports', section: 'sport' },
  entertainment: { message: 'Choose your station or podcast', section: 'listen' },
};

interface PersonalisePromptProps {
  segmentType: SegmentType | null;
}

export function PersonalisePrompt({ segmentType }: PersonalisePromptProps) {
  const [visible, setVisible] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);
  const [currentType, setCurrentType] = useState<SegmentType | null>(null);

  useEffect(() => {
    if (!segmentType || !prompts[segmentType]) {
      setVisible(false);
      return;
    }

    setCurrentType(segmentType);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [segmentType]);

  const prompt = currentType ? prompts[currentType] : null;
  if (!prompt || !visible) return null;

  return (
    <>
      <div
        className={cn(
          'rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 cursor-pointer transition-all animate-in slide-in-from-bottom-2 fade-in duration-300',
        )}
        onClick={() => {
          setSettingsSection(prompt.section);
          setVisible(false);
        }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm font-medium">{prompt.message}</p>
      </div>

      <SettingsDrawer
        section={settingsSection}
        onOpenChange={(open) => { if (!open) setSettingsSection(null); }}
      />
    </>
  );
}
