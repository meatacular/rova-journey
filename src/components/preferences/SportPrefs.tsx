'use client';

import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { cn } from '@/lib/utils';

const allCategories = [
  { id: 'rugby' as const, label: 'Rugby' },
  { id: 'cricket' as const, label: 'Cricket' },
  { id: 'league' as const, label: 'League' },
  { id: 'football' as const, label: 'Football' },
  { id: 'netball' as const, label: 'Netball' },
  { id: 'tennis' as const, label: 'Tennis' },
  { id: 'motorsport' as const, label: 'Motorsport' },
  { id: 'other' as const, label: 'Other' },
];

const lengthOptions = [
  { id: 'brief' as const, label: 'Brief', desc: '~30s' },
  { id: 'standard' as const, label: 'Standard', desc: '~60s' },
  { id: 'detailed' as const, label: 'Detailed', desc: '~90s' },
];

export function SportPrefs() {
  const { sport, setSportEnabled, toggleSportCategory, setSportLength } = usePreferences();

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between border-0 bg-secondary/50 p-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">Sport updates</span>
        </div>
        <Switch checked={sport.enabled} onCheckedChange={setSportEnabled} />
      </Card>

      {sport.enabled && (
        <>
          <Card className="border-0 bg-secondary/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Sports</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const selected = sport.categories.includes(cat.id);
                return (
                  <Badge
                    key={cat.id}
                    variant={selected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selected && 'bg-primary text-primary-foreground'
                    )}
                    onClick={() => toggleSportCategory(cat.id)}
                  >
                    {cat.label}
                  </Badge>
                );
              })}
            </div>
          </Card>

          <Card className="border-0 bg-secondary/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Length</h3>
            <div className="grid grid-cols-3 gap-2">
              {lengthOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSportLength(opt.id)}
                  className={cn(
                    'rounded-lg p-3 text-center transition-colors',
                    sport.length === opt.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/50 text-muted-foreground hover:bg-accent'
                  )}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs opacity-70">{opt.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
