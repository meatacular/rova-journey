'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usePreferences } from '@/lib/stores/preferences';
import { toast } from 'sonner';

const mockEvents = [
  { time: '9:00 AM', title: 'Stand-up', location: 'Teams', duration: '15 min' },
  { time: '10:30 AM', title: 'Sprint Planning', location: 'Meeting Room 3', duration: '1 hr' },
  { time: '12:00 PM', title: 'Lunch with Sarah', location: 'Depot Eatery', duration: '1 hr' },
  { time: '2:00 PM', title: 'Design Review', location: 'Zoom', duration: '45 min' },
  { time: '4:00 PM', title: '1:1 with Manager', location: 'Office', duration: '30 min' },
];

const providers = [
  { id: 'google' as const, name: 'Google Calendar', icon: '📅' },
  { id: 'apple' as const, name: 'Apple Calendar', icon: '🍎' },
  { id: 'microsoft' as const, name: 'Microsoft Outlook', icon: '📧' },
];

export function CalendarCard() {
  const { calendar, setCalendarConnected, setCalendarProvider } = usePreferences();
  const [expanded, setExpanded] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async (provider: 'google' | 'apple' | 'microsoft') => {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCalendarProvider(provider);
    setCalendarConnected(true);
    setConnecting(false);
    toast.success(`Connected to ${providers.find((p) => p.id === provider)?.name}`);
  };

  // Not connected — show connection prompt
  if (!calendar.connected) {
    return (
      <Card className="border-0 bg-secondary/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Connect your calendar</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          See your upcoming events during your journey
        </p>
        <div className="space-y-2">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => !connecting && handleConnect(provider.id)}
              className="flex w-full items-center gap-3 rounded-lg bg-background/50 p-3 text-left transition-colors hover:bg-background/80"
            >
              <span className="text-lg">{provider.icon}</span>
              <span className="text-sm font-medium flex-1">{provider.name}</span>
              {connecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : (
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </Card>
    );
  }

  // Connected — show next 2 events, expandable to all
  const visibleEvents = expanded ? mockEvents : mockEvents.slice(0, 2);

  return (
    <Card className="border-0 bg-secondary/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold flex-1">Today</h3>
        <span className="text-xs text-muted-foreground">{mockEvents.length} events</span>
      </div>
      <div className="space-y-2">
        {visibleEvents.map((event, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-background/50 p-2.5">
            <span className="text-xs font-mono text-primary mt-0.5 min-w-[52px]">
              {event.time}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.location} · {event.duration}</p>
            </div>
          </div>
        ))}
      </div>
      {mockEvents.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>{mockEvents.length - 2} more <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}
    </Card>
  );
}
