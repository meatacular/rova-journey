'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Cloud, Newspaper, Radio, Mic, Music, Trophy, Calendar } from 'lucide-react';
import { RoutePrefs } from './RoutePrefs';
import { WeatherPrefs } from './WeatherPrefs';
import { NewsPrefs } from './NewsPrefs';
import { SportPrefs } from './SportPrefs';
import { EntertainmentPrefs } from './EntertainmentPrefs';
import { VoicePrefs } from './VoicePrefs';
import { MusicBedPrefs } from './MusicBedPrefs';
import { CalendarPrefs } from './CalendarPrefs';

export function PreferenceCenter() {
  return (
    <Tabs defaultValue="route" className="w-full">
      <TabsList className="mb-4 flex w-full overflow-x-auto bg-secondary">
        <TabsTrigger value="route" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <MapPin className="h-4 w-4" />
          <span className="text-[10px]">Route</span>
        </TabsTrigger>
        <TabsTrigger value="weather" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Cloud className="h-4 w-4" />
          <span className="text-[10px]">Weather</span>
        </TabsTrigger>
        <TabsTrigger value="news" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Newspaper className="h-4 w-4" />
          <span className="text-[10px]">News</span>
        </TabsTrigger>
        <TabsTrigger value="sport" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Trophy className="h-4 w-4" />
          <span className="text-[10px]">Sport</span>
        </TabsTrigger>
        <TabsTrigger value="entertainment" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Radio className="h-4 w-4" />
          <span className="text-[10px]">Entertainment</span>
        </TabsTrigger>
        <TabsTrigger value="voice" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Mic className="h-4 w-4" />
          <span className="text-[10px]">Voice</span>
        </TabsTrigger>
        <TabsTrigger value="music-bed" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Music className="h-4 w-4" />
          <span className="text-[10px]">Bed</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex flex-col gap-0.5 px-2 py-2 text-xs data-[state=active]:text-primary">
          <Calendar className="h-4 w-4" />
          <span className="text-[10px]">Calendar</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="route"><RoutePrefs /></TabsContent>
      <TabsContent value="weather"><WeatherPrefs /></TabsContent>
      <TabsContent value="news"><NewsPrefs /></TabsContent>
      <TabsContent value="sport"><SportPrefs /></TabsContent>
      <TabsContent value="entertainment"><EntertainmentPrefs /></TabsContent>
      <TabsContent value="voice"><VoicePrefs /></TabsContent>
      <TabsContent value="music-bed"><MusicBedPrefs /></TabsContent>
      <TabsContent value="calendar"><CalendarPrefs /></TabsContent>
    </Tabs>
  );
}
