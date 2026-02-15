'use client';

import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { musicBeds } from '@/data/mock/music-beds';
import { cn } from '@/lib/utils';

const modes = [
  { id: 'auto' as const, label: 'Auto', desc: 'Matches your station' },
  { id: 'manual' as const, label: 'Manual', desc: 'Choose a style' },
  { id: 'none' as const, label: 'None', desc: 'No background music' },
];

export function MusicBedPrefs() {
  const { musicBed, setMusicBedMode, setMusicBedStyleId } = usePreferences();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose the vibe of the music under your traffic, weather and news.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setMusicBedMode(mode.id)}
            className={cn(
              'rounded-lg p-3 text-center transition-colors',
              musicBed.mode === mode.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-accent'
            )}
          >
            <p className="text-sm font-medium">{mode.label}</p>
            <p className="text-xs opacity-70">{mode.desc}</p>
          </button>
        ))}
      </div>

      {musicBed.mode === 'manual' && (
        <div className="space-y-2">
          {musicBeds.map((bed) => (
            <Card
              key={bed.id}
              className={cn(
                'cursor-pointer border-0 p-4 transition-all',
                musicBed.styleId === bed.id
                  ? 'ring-2 ring-primary'
                  : 'bg-secondary/50 hover:bg-secondary'
              )}
              onClick={() => setMusicBedStyleId(bed.id)}
            >
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">{bed.name}</p>
                  <p className="text-xs text-muted-foreground">{bed.description}</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">{bed.bpm} BPM</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
