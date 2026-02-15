'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Plus, Trash2, Calendar, Star } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { JourneyPreset } from '@/lib/types';
import { cn } from '@/lib/utils';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const segmentLabels = [
  { key: 'traffic' as const, label: 'Traffic' },
  { key: 'weather' as const, label: 'Weather' },
  { key: 'news' as const, label: 'News' },
  { key: 'sport' as const, label: 'Sport' },
  { key: 'entertainment' as const, label: 'Entertainment' },
];

export function JourneyPrefs() {
  const { journeys, updateJourney, addJourney, removeJourney, calendar } = usePreferences();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSetDefault = (id: string) => {
    journeys.forEach((j) => {
      updateJourney(j.id, { isDefault: j.id === id });
    });
  };

  const handleAddJourney = () => {
    const newJourney: JourneyPreset = {
      id: `custom-${Date.now()}`,
      name: 'New Journey',
      icon: '📍',
      from: '',
      to: '',
      segments: { traffic: true, weather: true, news: true, sport: false, entertainment: true },
      schedule: { enabled: false, days: [1, 2, 3, 4, 5], time: '08:00' },
      calendarSync: false,
      isDefault: false,
    };
    addJourney(newJourney);
    setExpandedId(newJourney.id);
  };

  const toggleDay = (journeyId: string, day: number) => {
    const journey = journeys.find((j) => j.id === journeyId);
    if (!journey) return;
    const days = journey.schedule.days.includes(day)
      ? journey.schedule.days.filter((d) => d !== day)
      : [...journey.schedule.days, day].sort();
    updateJourney(journeyId, { schedule: { ...journey.schedule, days } });
  };

  const toggleSegment = (journeyId: string, segKey: keyof JourneyPreset['segments']) => {
    const journey = journeys.find((j) => j.id === journeyId);
    if (!journey) return;
    updateJourney(journeyId, {
      segments: { ...journey.segments, [segKey]: !journey.segments[segKey] },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Customise your journeys, set schedules, and choose what plays during each trip.
      </p>

      <div className="space-y-2">
        {journeys.map((journey) => {
          const isExpanded = expandedId === journey.id;

          return (
            <Card key={journey.id} className="border-0 bg-secondary/50 overflow-hidden">
              {/* Header row */}
              <button
                className="flex w-full items-center gap-3 p-4 text-left"
                onClick={() => setExpandedId(isExpanded ? null : journey.id)}
              >
                <span className="text-2xl">{journey.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{journey.name}</span>
                    {journey.isDefault && (
                      <Star className="h-3 w-3 text-primary fill-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {journey.from || '...'} → {journey.to || '...'}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {/* Expanded editor */}
              {isExpanded && (
                <div className="border-t border-border/40 p-4 space-y-4">
                  {/* Name & Icon */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Journey Name</label>
                    <Input
                      value={journey.name}
                      onChange={(e) => updateJourney(journey.id, { name: e.target.value })}
                      className="h-9 bg-background/50"
                    />
                  </div>

                  {/* From / To */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">From</label>
                      <Input
                        value={journey.from}
                        onChange={(e) => updateJourney(journey.id, { from: e.target.value })}
                        className="h-9 bg-background/50"
                        placeholder="Start location"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">To</label>
                      <Input
                        value={journey.to}
                        onChange={(e) => updateJourney(journey.id, { to: e.target.value })}
                        className="h-9 bg-background/50"
                        placeholder="Destination"
                      />
                    </div>
                  </div>

                  {/* Segments */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Segments</label>
                    <div className="flex flex-wrap gap-2">
                      {segmentLabels.map(({ key, label }) => (
                        <Badge
                          key={key}
                          variant={journey.segments[key] ? 'default' : 'outline'}
                          className={cn(
                            'cursor-pointer transition-colors',
                            journey.segments[key]
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent'
                          )}
                          onClick={() => toggleSegment(journey.id, key)}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground">Schedule</label>
                      <Switch
                        checked={journey.schedule.enabled}
                        onCheckedChange={(checked) =>
                          updateJourney(journey.id, {
                            schedule: { ...journey.schedule, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {journey.schedule.enabled && (
                      <div className="space-y-3">
                        <div className="flex gap-1">
                          {dayLabels.map((label, i) => (
                            <button
                              key={i}
                              onClick={() => toggleDay(journey.id, i)}
                              className={cn(
                                'flex-1 rounded-md py-1.5 text-[10px] font-medium transition-colors',
                                journey.schedule.days.includes(i)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-background/50 text-muted-foreground hover:bg-accent'
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Departure Time</label>
                          <Input
                            type="time"
                            value={journey.schedule.time}
                            onChange={(e) =>
                              updateJourney(journey.id, {
                                schedule: { ...journey.schedule, time: e.target.value },
                              })
                            }
                            className="h-9 bg-background/50 w-32"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calendar Sync */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Calendar Sync
                        {!calendar.connected && (
                          <span className="ml-1 text-muted-foreground/50">(connect in Calendar tab)</span>
                        )}
                      </span>
                    </div>
                    <Switch
                      checked={journey.calendarSync}
                      onCheckedChange={(checked) =>
                        updateJourney(journey.id, { calendarSync: checked })
                      }
                      disabled={!calendar.connected}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant={journey.isDefault ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleSetDefault(journey.id)}
                      disabled={journey.isDefault}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      {journey.isDefault ? 'Default' : 'Set as Default'}
                    </Button>
                    {!journey.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive"
                        onClick={() => {
                          removeJourney(journey.id);
                          setExpandedId(null);
                        }}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddJourney}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Journey
      </Button>
    </div>
  );
}
