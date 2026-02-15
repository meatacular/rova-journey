'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { JourneyPrefs } from '@/components/preferences/JourneyPrefs';
import { RoutePrefs } from '@/components/preferences/RoutePrefs';
import { WeatherPrefs } from '@/components/preferences/WeatherPrefs';
import { NewsPrefs } from '@/components/preferences/NewsPrefs';
import { SportPrefs } from '@/components/preferences/SportPrefs';
import { EntertainmentPrefs } from '@/components/preferences/EntertainmentPrefs';
import { VoicePrefs } from '@/components/preferences/VoicePrefs';
import { MusicBedPrefs } from '@/components/preferences/MusicBedPrefs';
import { CalendarPrefs } from '@/components/preferences/CalendarPrefs';
import { Slider } from '@/components/ui/slider';
import { usePreferences } from '@/lib/stores/preferences';

export type SettingsSection =
  | 'journeys'
  | 'traffic'
  | 'weather'
  | 'news'
  | 'sport'
  | 'listen'
  | 'calendar';

const sectionTitles: Record<SettingsSection, string> = {
  journeys: 'Journey Settings',
  traffic: 'Traffic Settings',
  weather: 'Weather Settings',
  news: 'News Settings',
  sport: 'Sport Settings',
  listen: 'Listen Settings',
  calendar: 'Calendar Settings',
};

interface SettingsDrawerProps {
  section: SettingsSection | null;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ section, onOpenChange }: SettingsDrawerProps) {
  const { voiceSpeed, setVoiceSpeed } = usePreferences();

  return (
    <Sheet open={section !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>{section ? sectionTitles[section] : 'Settings'}</SheetTitle>
        </SheetHeader>

        <div className="pb-8">
          {section === 'journeys' && <JourneyPrefs />}

          {section === 'traffic' && <RoutePrefs />}

          {section === 'weather' && <WeatherPrefs />}

          {section === 'news' && <NewsPrefs />}

          {section === 'sport' && <SportPrefs />}

          {section === 'listen' && (
            <div className="space-y-6">
              {/* Voice Speed */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Voice Speed</h3>
                  <span className="text-sm text-muted-foreground">{voiceSpeed.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[voiceSpeed]}
                  onValueChange={([v]) => setVoiceSpeed(v)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-3">Voice</h3>
                <VoicePrefs />
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-3">Station / Podcast</h3>
                <EntertainmentPrefs />
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-3">Music Bed</h3>
                <MusicBedPrefs />
              </section>
            </div>
          )}

          {section === 'calendar' && <CalendarPrefs />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
