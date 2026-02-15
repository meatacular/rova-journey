'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Cloud, Newspaper, Radio, Mic, Music } from 'lucide-react';
import { RoutePrefs } from './RoutePrefs';
import { WeatherPrefs } from './WeatherPrefs';
import { NewsPrefs } from './NewsPrefs';
import { EntertainmentPrefs } from './EntertainmentPrefs';
import { VoicePrefs } from './VoicePrefs';
import { MusicBedPrefs } from './MusicBedPrefs';

export function PreferenceCenter() {
  return (
    <Tabs defaultValue="route" className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-6 bg-secondary">
        <TabsTrigger value="route" className="flex flex-col gap-0.5 px-1 py-2 text-xs data-[state=active]:text-primary">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Route</span>
        </TabsTrigger>
        <TabsTrigger value="weather" className="flex flex-col gap-0.5 px-1 py-2 text-xs data-[state=active]:text-primary">
          <Cloud className="h-4 w-4" />
          <span className="hidden sm:inline">Weather</span>
        </TabsTrigger>
        <TabsTrigger value="news" className="flex flex-col gap-0.5 px-1 py-2 text-xs data-[state=active]:text-primary">
          <Newspaper className="h-4 w-4" />
          <span className="hidden sm:inline">News</span>
        </TabsTrigger>
        <TabsTrigger value="entertainment" className="flex flex-col gap-0.5 px-1 py-2 text-xs data-[state=active]:text-primary">
          <Radio className="h-4 w-4" />
          <span className="hidden sm:inline">Music</span>
        </TabsTrigger>
        <TabsTrigger value="voice" className="flex flex-col gap-0.5 px-1 py-2 text-xs data-[state=active]:text-primary">
          <Mic className="h-4 w-4" />
          <span className="hidden sm:inline">Voice</span>
        </TabsTrigger>
        <TabsTrigger value="music-bed" className="flex flex-col gap-0.5 px-1 py-2 text-xs data-[state=active]:text-primary">
          <Music className="h-4 w-4" />
          <span className="hidden sm:inline">Bed</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="route"><RoutePrefs /></TabsContent>
      <TabsContent value="weather"><WeatherPrefs /></TabsContent>
      <TabsContent value="news"><NewsPrefs /></TabsContent>
      <TabsContent value="entertainment"><EntertainmentPrefs /></TabsContent>
      <TabsContent value="voice"><VoicePrefs /></TabsContent>
      <TabsContent value="music-bed"><MusicBedPrefs /></TabsContent>
    </Tabs>
  );
}
