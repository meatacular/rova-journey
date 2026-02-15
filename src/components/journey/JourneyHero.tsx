'use client';

import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePreferences } from '@/lib/stores/preferences';
import { stations } from '@/data/mock/stations';

interface JourneyHeroProps {
  onStart: () => void;
  estimatedDuration: number;
}

export function JourneyHero({ onStart, estimatedDuration }: JourneyHeroProps) {
  const { homeAddress, workAddress, entertainment } = usePreferences();
  const station = stations.find((s) => s.id === entertainment.stationId);
  const stationColor = station?.color || '#e31937';

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-secondary to-background">
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(to right, ${stationColor}, ${stationColor}88)` }}
      />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{homeAddress}</span>
          <ChevronRight className="h-3 w-3" />
          <span>{workAddress}</span>
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>~{estimatedDuration} min journey</span>
        </div>

        <Button
          onClick={onStart}
          className="w-full text-base font-semibold"
          size="lg"
          style={{
            background: `linear-gradient(135deg, ${stationColor}, ${stationColor}cc)`,
          }}
        >
          Start Journey
        </Button>
      </div>
    </Card>
  );
}
