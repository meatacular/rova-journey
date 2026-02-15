'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { voices } from '@/data/mock/voices';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function VoicePrefs() {
  const { voiceId, setVoiceId } = usePreferences();

  return (
    <div className="space-y-2">
      {voices.map((voice) => (
        <Card
          key={voice.id}
          className={cn(
            'cursor-pointer border-0 p-4 transition-all',
            voiceId === voice.id
              ? 'ring-2 ring-primary'
              : 'bg-secondary/50 hover:bg-secondary'
          )}
          onClick={() => setVoiceId(voice.id)}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{voice.avatar}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{voice.name}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {voice.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toast('Voice preview coming soon');
              }}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
