'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Loader2 } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { toast } from 'sonner';

const providers = [
  { id: 'google' as const, name: 'Google Calendar', icon: '📅', color: '#4285F4' },
  { id: 'apple' as const, name: 'Apple Calendar', icon: '🍎', color: '#333' },
  { id: 'microsoft' as const, name: 'Microsoft Outlook', icon: '📧', color: '#0078D4' },
];

const mockEvents = [
  { time: '9:00 AM', title: 'Stand-up', location: 'Teams', duration: '15 min' },
  { time: '10:30 AM', title: 'Sprint Planning', location: 'Meeting Room 3', duration: '1 hr' },
  { time: '12:00 PM', title: 'Lunch with Sarah', location: 'Depot Eatery', duration: '1 hr' },
  { time: '2:00 PM', title: 'Design Review', location: 'Zoom', duration: '45 min' },
  { time: '4:00 PM', title: '1:1 with Manager', location: 'Office', duration: '30 min' },
];

export function CalendarPrefs() {
  const { calendar, setCalendarConnected, setCalendarProvider } = usePreferences();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async (provider: 'google' | 'apple' | 'microsoft') => {
    setConnecting(true);
    // Simulate connection dialog
    await new Promise((r) => setTimeout(r, 1500));
    setCalendarProvider(provider);
    setCalendarConnected(true);
    setConnecting(false);
    toast.success(`Connected to ${providers.find((p) => p.id === provider)?.name}`);
  };

  const handleDisconnect = () => {
    setCalendarConnected(false);
    setCalendarProvider(null);
    toast('Calendar disconnected');
  };

  return (
    <div className="space-y-4">
      {!calendar.connected ? (
        <>
          <p className="text-sm text-muted-foreground">
            Connect your calendar to hear upcoming events during your journey.
          </p>
          <div className="space-y-2">
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className="cursor-pointer border-0 bg-secondary/50 p-4 transition-all hover:bg-secondary"
                onClick={() => !connecting && handleConnect(provider.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{provider.name}</p>
                  </div>
                  {connecting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <Card className="border-0 bg-secondary/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">
                  Connected to {providers.find((p) => p.id === calendar.provider)?.name}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </Card>

          <Card className="border-0 bg-secondary/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Today&apos;s Events</h3>
            <div className="space-y-2">
              {mockEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-background/50 p-3">
                  <span className="text-xs font-mono text-primary mt-0.5 min-w-[60px]">
                    {event.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.location} · {event.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
