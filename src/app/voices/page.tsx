'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Check } from 'lucide-react';
import { voices } from '@/data/mock/voices';
import { stations } from '@/data/mock/stations';
import { usePreferences } from '@/lib/stores/preferences';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function VoicesPage() {
  const { voiceId, setVoiceId } = usePreferences();

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Voices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose who narrates your journey
          </p>
        </div>

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
                  <span className="text-3xl">{voice.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{voice.name}</h3>
                      {station && (
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: station.color }}
                        />
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
