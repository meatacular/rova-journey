'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Check, Music } from 'lucide-react';
import { voices } from '@/data/mock/voices';
import { musicBeds } from '@/data/mock/music-beds';
import { usePreferences } from '@/lib/stores/preferences';
import { cn } from '@/lib/utils';

const musicModes = [
  { id: 'auto' as const, label: 'Auto', desc: 'Matches your station' },
  { id: 'manual' as const, label: 'Manual', desc: 'Choose a style' },
  { id: 'none' as const, label: 'None', desc: 'No background music' },
];

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const {
    voiceSpeed,
    setVoiceSpeed,
    voiceId,
    setVoiceId,
    musicBed,
    setMusicBedMode,
    setMusicBedStyleId,
  } = usePreferences();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-8">
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

          {/* Voice */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Voice</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {voices.map((voice) => {
                const isSelected = voiceId === voice.id;
                return (
                  <button
                    key={voice.id}
                    onClick={() => setVoiceId(voice.id)}
                    className={cn(
                      'flex-shrink-0 rounded-lg p-3 text-center transition-colors w-24',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-accent'
                    )}
                  >
                    <span className="text-2xl">{voice.avatar}</span>
                    <p className="text-xs font-medium mt-1 truncate">{voice.name.split(' ')[0]}</p>
                    {isSelected && <Check className="h-3 w-3 mx-auto mt-1" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Music Bed */}
          <section>
            <h3 className="text-sm font-semibold mb-3">Music Bed</h3>
            <div className="grid grid-cols-3 gap-2">
              {musicModes.map((mode) => (
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
              <div className="space-y-2 mt-3">
                {musicBeds.map((bed) => (
                  <Card
                    key={bed.id}
                    className={cn(
                      'cursor-pointer border-0 p-3 transition-all',
                      musicBed.styleId === bed.id
                        ? 'ring-2 ring-primary'
                        : 'bg-secondary/50 hover:bg-secondary'
                    )}
                    onClick={() => setMusicBedStyleId(bed.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Music className="h-4 w-4 text-muted-foreground" />
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
          </section>

          {/* About */}
          <section>
            <h3 className="text-sm font-semibold mb-2">About</h3>
            <p className="text-xs text-muted-foreground">rova journeys v1.0</p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
