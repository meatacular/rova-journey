'use client';

import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { NewsCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

const allCategories: { id: NewsCategory; label: string }[] = [
  { id: 'nz', label: 'NZ' },
  { id: 'sport', label: 'Sport' },
  { id: 'politics', label: 'Politics' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'business', label: 'Business' },
  { id: 'tech', label: 'Tech' },
  { id: 'crime', label: 'Crime' },
  { id: 'world', label: 'World' },
];

const lengthOptions: { id: 'brief' | 'standard' | 'detailed'; label: string; desc: string }[] = [
  { id: 'brief', label: 'Brief', desc: '~30s' },
  { id: 'standard', label: 'Standard', desc: '~60s' },
  { id: 'detailed', label: 'Detailed', desc: '~90s' },
];

export function NewsPrefs() {
  const { news, setNewsEnabled, toggleNewsCategory, setNewsLength } = usePreferences();

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between border-0 bg-secondary/50 p-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-red-400" />
          <span className="text-sm font-medium">News updates</span>
        </div>
        <Switch checked={news.enabled} onCheckedChange={setNewsEnabled} />
      </Card>

      {news.enabled && (
        <>
          <Card className="border-0 bg-secondary/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const selected = news.categories.includes(cat.id);
                return (
                  <Badge
                    key={cat.id}
                    variant={selected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selected && 'bg-primary text-primary-foreground'
                    )}
                    onClick={() => toggleNewsCategory(cat.id)}
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
                  onClick={() => setNewsLength(opt.id)}
                  className={cn(
                    'rounded-lg p-3 text-center transition-colors',
                    news.length === opt.id
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
