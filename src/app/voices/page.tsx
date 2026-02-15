'use client';

import Image from 'next/image';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Check } from 'lucide-react';
import { voices } from '@/data/mock/voices';
import { stations } from '@/data/mock/stations';
import { usePreferences } from '@/lib/stores/preferences';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function VoicesPage() {
  const { voiceId, setVoiceId, voiceSpeed, setVoiceSpeed } = usePreferences();

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Voices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose who narrates your journey
          </p>
        </div>

        {/* Speed slider */}
        <Card className="border-0 bg-secondary/50 p-4">
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
        </Card>

        <div className="space-y-3">
          {voices.map((voice) => {
            const station = voice.station
              ? stations.find((s) => s.id === voice.station)
              : null;
            const isSelected = voiceId === voice.id;

            return (
              <Card
                key={voice.id}
                className={cn(
                  'border-0 p-4 transition-all',
                  isSelected
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'bg-secondary/50'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={voice.photo}
                      alt={voice.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{voice.name}</h3>
                      {station && (
                        <span className="text-xs text-muted-foreground">
                          {station.name}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {voice.description}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => toast('Voice preview coming soon')}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setVoiceId(voice.id)}
                      >
                        {isSelected ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
