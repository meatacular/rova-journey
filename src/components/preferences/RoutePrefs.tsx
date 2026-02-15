'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { MapPin, Car } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';

const cities = [
  { id: 'auckland', name: 'Auckland' },
  { id: 'wellington', name: 'Wellington' },
  { id: 'christchurch', name: 'Christchurch' },
  { id: 'hamilton', name: 'Hamilton' },
];

export function RoutePrefs() {
  const {
    homeAddress, workAddress, city, traffic,
    setHomeAddress, setWorkAddress, setCity, setTrafficEnabled,
  } = usePreferences();

  return (
    <div className="space-y-4">
      <Card className="border-0 bg-secondary/50 p-4">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-green-400" /> City
        </label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="border-0 bg-secondary/50 p-4 space-y-3">
        <label className="mb-1 flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-blue-400" /> Home
        </label>
        <Input value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} placeholder="e.g. Grey Lynn" />

        <label className="mt-2 mb-1 flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-red-400" /> Work
        </label>
        <Input value={workAddress} onChange={(e) => setWorkAddress(e.target.value)} placeholder="e.g. Auckland CBD" />
      </Card>

      <Card className="flex items-center justify-between border-0 bg-secondary/50 p-4">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-medium">Traffic updates</span>
        </div>
        <Switch checked={traffic.enabled} onCheckedChange={setTrafficEnabled} />
      </Card>
    </div>
  );
}
