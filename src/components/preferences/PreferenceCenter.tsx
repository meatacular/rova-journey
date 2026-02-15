'use client';

import { Navigation, Newspaper, Radio, Calendar } from 'lucide-react';
import { JourneyPrefs } from './JourneyPrefs';
import { RoutePrefs } from './RoutePrefs';
import { WeatherPrefs } from './WeatherPrefs';
import { NewsPrefs } from './NewsPrefs';
import { SportPrefs } from './SportPrefs';
import { EntertainmentPrefs } from './EntertainmentPrefs';
import { CalendarPrefs } from './CalendarPrefs';

function SectionHeading({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

function SubHeading({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-muted-foreground pt-4 pb-1">{title}</h3>;
}

export function PreferenceCenter() {
  return (
    <div className="space-y-8">
      {/* My Journeys */}
      <section>
        <SectionHeading icon={Navigation} title="My Journeys" />
        <JourneyPrefs />
      </section>

      {/* Content */}
      <section>
        <SectionHeading icon={Newspaper} title="Content" />
        <div className="space-y-2">
          <SubHeading title="Route & Traffic" />
          <RoutePrefs />
          <SubHeading title="Weather" />
          <WeatherPrefs />
          <SubHeading title="News" />
          <NewsPrefs />
          <SubHeading title="Sport" />
          <SportPrefs />
        </div>
      </section>

      {/* Entertainment */}
      <section>
        <SectionHeading icon={Radio} title="Entertainment" />
        <EntertainmentPrefs />
      </section>

      {/* Calendar */}
      <section>
        <SectionHeading icon={Calendar} title="Calendar" />
        <CalendarPrefs />
      </section>
    </div>
  );
}
