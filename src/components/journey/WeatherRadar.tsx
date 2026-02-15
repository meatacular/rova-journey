'use client';

import { useEffect, useState } from 'react';

export function WeatherRadar() {
  const [frame, setFrame] = useState(0);

  // Cycle through 6 frames over 3 seconds (500ms per frame)
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % 6);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-xl bg-secondary/50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rain Radar</span>
        <span className="text-[10px] text-muted-foreground/60">Next 30 min forecast</span>
      </div>

      {/* Radar display */}
      <div className="relative w-full aspect-[2/1] rounded-lg bg-[#0a1628] overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-sky-400" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-sky-400" />
          <div className="absolute top-1/4 left-0 right-0 h-px bg-sky-400" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-sky-400" />
        </div>

        {/* Center point (your location) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Rain cells - animated blobs that shift with each frame */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-linear"
          style={{ transform: `translateX(${frame * 3 - 8}%) translateY(${-frame * 1.5 + 4}%)` }}
        >
          {/* Light rain patch */}
          <div className="absolute top-[15%] left-[10%] w-[30%] h-[25%] rounded-full bg-green-500/30 blur-lg" />
          {/* Moderate rain */}
          <div className="absolute top-[35%] left-[25%] w-[20%] h-[20%] rounded-full bg-yellow-500/25 blur-md" />
          {/* Heavy rain cell */}
          <div className="absolute top-[30%] left-[55%] w-[15%] h-[18%] rounded-full bg-orange-500/30 blur-md" />
          {/* Light rain trailing */}
          <div className="absolute top-[55%] left-[40%] w-[25%] h-[20%] rounded-full bg-green-500/20 blur-lg" />
          {/* Another cell */}
          <div className="absolute top-[20%] left-[70%] w-[18%] h-[22%] rounded-full bg-green-400/25 blur-lg" />
        </div>

        {/* Radar sweep line */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom-left h-[50%] w-px"
          style={{
            background: 'linear-gradient(to top, transparent, rgba(56, 189, 248, 0.4))',
            transform: `rotate(${frame * 60}deg)`,
            transition: 'transform 0.5s linear',
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-1.5 right-1.5 flex gap-1.5 text-[8px] text-white/60">
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Light</span>
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Mod</span>
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Heavy</span>
        </div>

        {/* Location label */}
        <div className="absolute top-1.5 left-1.5 text-[9px] text-white/50 font-medium">Auckland</div>
      </div>
    </div>
  );
}
